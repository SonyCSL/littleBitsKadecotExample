const SERIAL_PORT_NAME	= 'COM4'; // Arduinoが接続されているポート名
const SERIAL_BIT_RATE	= 9600; // Arduinoのスケッチで設定した値と同じにする
const KADECOT_IP = '192.168.11.121' ;

onload = function(){
	function msg(txt){
		$('#msgdiv').html($('#msgdiv').html()+txt+'<br />') ;
	}

	var SERIAL = {
		connectionId : 0
		, connect : function(){
		    msg( 'Connecting to '+SERIAL_PORT_NAME ) ;
		    chrome.serial.connect(SERIAL_PORT_NAME, {"bitrate":SERIAL_BIT_RATE},  openInfo => {
		      msg( 'Connected to '+SERIAL_PORT_NAME ) ;
		      // Serial connection ID
		      console.log(openInfo);
		      this.connectionId = openInfo.connectionId;
		      chrome.serial.onReceive.addListener(this.ondata);
		    });
		}

		// Currently unused.
		, disconnect : function(){
		    chrome.serial.disconnect(this.connectionId, result => {
		      if(result == true )
		        msg('Serial port closed') ;
		      else
		        msg('Error: Serial port was not closed') ;
		    });
		}
		, send : function(str){
			var buf=new ArrayBuffer(str.length);
			var bufView=new Uint8Array(buf);
			for (var i=0; i<str.length; i++) {
				bufView[i]=str.charCodeAt(i);
			}
			chrome.serial.send( this.connectionId, buf, console.log ) ;
		}
		, ondata : function(info){
		    //console.log(info);
		    if(info.data.byteLength == 0) return ;

		    // data->Uint8Array->Unicode string
		    var str=String.fromCharCode.apply(null, new Uint8Array(info.data));
		    msg('Serial:'+str);

		    switch(str){
		    case '1' :
			powerStateToggle = !powerStateToggle ;
			KADECOT.lightPower(powerStateToggle) ;
			KADECOT.airconPower(powerStateToggle) ;
			break ;
		    case '0' :
			// Do nothing
		    }
		}
	} ;

	//　ボタンを押せば１、離せば０が帰ってくるが、押しているときだけONというのもいまいち
	//　なので、1が来るたびにON/OFFを切り替えるために現状を覚えておく変数
	var powerStateToggle = false ;

	// KadecotのWAMP API関連の機能をまとめる
	var KADECOT = {
		aircons : []	// みつかった全エアコンを保持
		,lights : []	// みつかった全照明を保持

		// connect()内から機器が見つかったタイミングで呼ばれる。
		,onDeviceFound : function(devlist){
			msg('Connected to Kadecot and devices are found.') ;
			console.log('Devlist : '+JSON.stringify(devlist)) ;

			devlist.forEach( d => {
				if( d.protocol == 'echonetlite' ){
					switch( d.deviceType ){
					case 'GeneralLighting' :
						msg( 'Light found:'+d.nickname ) ;
						this.lights.push(d) ;
						break ;
					case 'HomeAirConditioner' :
						msg( 'HomeAirConditioner found:' +d.nickname ) ;
						this.aircons.push(d) ;
						break ;
					}
				}
			}) ;

			// PubSub (変更通知受け取り)の基本。See http://kadecot.net/blog/2758/
			// ECHONET Liteの場合、各機器ごとにSubscribeすることはできない。例えばエアコンなら
			// 全エアコンの電源変更にSubscribeし、変更通知があった時にどこから来たかを判定しないといけない。
			// Subscribe for status change
			if( this.lights.length > 0 ){
				this.wamp.sendSubscribe({}
					// 「照明の電源」を意味するtopic : See http://app.kadecot.net/docs/ProcTopic/
					,"com.sonycsl.kadecot.echonetlite.topic.GeneralLighting.OperationStatus"
					,r => {	// 変更通知
						msg('Light '+r[4][0]+' power changed to '+r[5].propertyValue[0]);
						// Change littleBits LED state
						var newState = (r[5].propertyValue[0] == 48) ;
						SERIAL.send( newState ? '1' : '0' ) ;
					}
					,() => {msg('Subscribed to light power');}	// Subscribe成功
				);
			}
			if( this.aircons.length > 0 ){
				this.wamp.sendSubscribe({}
					// 「エアコンの電源」を意味するtopic : See http://app.kadecot.net/docs/ProcTopic/echo_devices.html
					,"com.sonycsl.kadecot.echonetlite.topic.HomeAirConditioner.OperationStatus"
					,r => {	// 変更通知
						msg('Aircon '+r[4][0]+' power changed to '+r[5].propertyValue[0]);
						// Do nothing
					}
					,() => {msg('Subscribed to aircon power');}	// Subscribe成功
				);
			}

		}
		// 全エアコンの電源変更リクエスト。WAMP RPCを用いている See  http://kadecot.net/blog/2758/
		, airconPower : function(bOn){
			this.aircons.forEach( d => {
				this.wamp.sendCall(
					{}
					// 「エアコンのプロパティを設定する」という意味のProcedure.
					// See http://app.kadecot.net/docs/ProcTopic/echo_devices.html
					,'com.sonycsl.kadecot.echonetlite.procedure.HomeAirConditioner.set'
					// 変更対象エアコンのデバイスID（Kadecotが割り当てるもの）
					,[d.deviceId]
					// 電源を48(ON)または49(OFF)にする。ECHONET Liteの仕様参照：
					,{'propertyName':'OperationStatus' ,'propertyValue':[bOn?48:49] }
				);
			} ) ;
		}
		// 全照明の電源変更リクエスト。
		, lightPower : function(bOn){
			this.lights.forEach( d => {
				this.wamp.sendCall(
					{}
					,'com.sonycsl.kadecot.echonetlite.procedure.GeneralLighting.set'
					,[d.deviceId]
					,{'propertyName':'OperationStatus' ,'propertyValue':[bOn?48:49] }
				);
			} ) ;
		}
		,connect : function(){
			// 以下Kadecot接続と機器発見の決まり文句. See http://kadecot.net/blog/2756/
			var wamp = new WampClientBrowser() ;
			this.wamp = wamp ;
			wamp.addOpenCallback(()=>{
				wamp.sendHello("v1", {"roles":{"caller":{},"subscriber":{}}}, () => {
					// request device list
					wamp.sendCall({}, "com.sonycsl.kadecot.provider.procedure.getDeviceList", null, null, ret => {
						this.onDeviceFound(ret[4].deviceList) ;
					});
				} ) ;
			} ) ;

			wamp.connect( 'ws://'+KADECOT_IP+':41314','com.sonycsl.kadecot');
		}
	} ;

	SERIAL.connect() ;
	KADECOT.connect() ;
} ;