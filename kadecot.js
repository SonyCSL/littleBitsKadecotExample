
//$(function(){
	var wamp;
	var lightID;
/*
  	$("#init").click(init);
  	$("#lightOn").click(lightOn);
  	$("#lightOff").click(lightOff);
  	$("#lightChange").click(lightChange);
*/
	function init(){
		var wampClient = new WampClientBrowser() ;
		
		wampClient.addOpenCallback(function(){
			wampClient.sendHello("v1", {"roles":{"caller":{},"subscriber":{}}}, function(){
				// request device list
				wampClient.sendCall({}, "com.sonycsl.kadecot.provider.procedure.getDeviceList", null, null, function(ret){
					console.log('Devlist reply! : '+JSON.stringify(arguments)) ;
					ret[4].deviceList.forEach((d)=>{
						if( d.protocol == 'echonetlite' && d.deviceType == 'GeneralLighting'){
							lightID=d.deviceId;
						}
					})
				});
			} ) ;
		} ) ;
		
		wampClient.connect("ws://192.168.11.121:41314","com.sonycsl.kadecot");
		wamp=wampClient;
		//document.getElementById('state').addEventListener("click",lightChange);
	}

	function sendecho(devId,procedure,propName,propValue){
		wamp.sendCall(
			{"deviceId":devId}
			,procedure
			,[devId]
			,{"propertyName":propName ,"propertyValue":propValue }
		);
	}

	function lightOn() {
		console.log("light on");
		sendecho(lightID,
		"com.sonycsl.kadecot.echonetlite.procedure.GeneralLighting.set",
		"OperationStatus",[48])
	}
	function lightOff(){
		console.log("light off");
		sendecho(lightID,
		"com.sonycsl.kadecot.echonetlite.procedure.GeneralLighting.set",
		"OperationStatus",[49])
	}

	init();
//})
$(function(){
  var connectionId = 0;
  var intervalId   = 0;
  var portName     = "COM3"; // Arduinoが接続されているポート名
  var bitRate      = {"bitrate":9600}; // Arduinoのスケッチで設定した値と同じにする


  $("#start").click(startConnection);
  $("#end").click(endConnection);

  function startConnection(){
    // シリアルポート接続開始関数
    chrome.serial.connect(portName, bitRate, function(openInfo){
      // 接続ID保存
      console.log(openInfo);
      connectionId = openInfo.connectionId;
      chrome.serial.onReceive.addListener(readData);
    });
    console.log("start serial");
  };

  function endConnection(){
    // シリアルポート接続終了関数
    chrome.serial.disconnect(connectionId, function(result){
      if(result == true)
        clearInterval(intervalId);
      else
        console.log("close fail");
    });
    console.log("end serial");
  };

  function readData(info){
    console.log(info);
    var str;
    if(info.data.byteLength > 0){
      // 取得したデータをUint8Arrayオブジェクトとして格納
      var arr = new Uint8Array(info.data);
      // Unicodeを文字列に変更し、コンソールに表示する
      console.log(String.fromCharCode.apply(null, arr));
    }
    str=String.fromCharCode.apply(null, arr);
    if(str.indexOf("on")!=-1){
      document.getElementById('state').value="on";
      lightOn();
    }else if(str.indexOf("off")!=-1){
      document.getElementById('state').value="off";
      lightOff();
    }
  }
});
