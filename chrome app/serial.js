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
    /*
    // シリアル通信データ取得関数
    var readByte = 64;
    chrome.serial.read(connectionId, readByte, function (readInfo){
      if(readInfo.bytesRead > 0){
        // 取得したデータをUint8Arrayオブジェクトとして格納
        var arr = new Uint8Array(readInfo.data);
        // Unicodeを文字列に変更し、コンソールに表示する
        console.log(String.fromCharCode.apply(null, arr));
      }
    });
    */
    //console.log(info.connectionId);
    //console.log(info.data);
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
    }else if(str.indexOf("off")!=-1){
      document.getElementById('state').value="off";
    }
  }
});
