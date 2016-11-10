	
var ArgumentNullException = function () { };

var wampSerializer = new WampSerializer();
var wampDeserializer = new WampDeserializer();
var wampClientCore = new WampClientCore();
var wampConnectRetryNum = 3 ;

var WampClientBrowser = (function () {

  var TOKEN_KEY = "__kadecot_saved_token";
  var SCOPE_KEY = "__kadecot_saved_scope";
  var WampClientBrowser = function () {
    this.challenge_flag = false;
    this.url = null;
    this.protocols = ['wamp.2.json'];
    this.ws = null;
    this.on_open_flag = false;
    this.errorCallback = null;
    this.request_id = 1;
    this.subscription_id_list = [];

    this.token_key = '' ;
  };

  var strip_kadecot_ip = function(wsurl){
    // remove ws:// and :41314
    return wsurl.replace(/^ws:\/\//,"").replace(/:41314\/?/,"");
  };
  var strip_web_address = function(url){
    return url.replace(/\?.*$/,"");
  };
  var remove_sharp = function(url){
    return url.replace(/\/?#.*$/,"");
  };

  WampClientBrowser.prototype.connect = function (url,scope){
    console.log("[WAMP Client] websocket connecting");
    if(scope === undefined){
      console.log("[WAMP Client] WARNING:Scope was not specified!");
      scope = "com.sonycsl.kadecot";
    }

    this.scope = scope;
    if(!url) alert('Connect called without URL') ;

    this.url = url;

    var kadecot_ip = remove_sharp(strip_kadecot_ip(url)) ;
    if( kadecot_ip.indexOf('?')>0 ){
	kadecot_ip = kadecot_ip.substring(0,kadecot_ip.indexOf('?')) ;
    }
    this.kadecot_ip = kadecot_ip ;

    var here = location.href ;
    /*if( here.indexOf("#") !== -1 ){	// Token supplied by URL
	  chrome.storage.local.setItem(TOKEN_KEY , here.split("#")[1]);
	  chrome.storage.local.setItem(SCOPE_KEY, scope);
    } else if( chrome.storage.local.getItem(TOKEN_KEY) == null ){	// Token not supplied by URL nor chrome.storage.local
	  chrome.storage.local.setItem(TOKEN_KEY , 'none' );
	  chrome.storage.local.setItem(SCOPE_KEY, scope);
    }*/
    var ls_token = here.split("#")[1];//chrome.storage.local.getItem(TOKEN_KEY);
    var ls_scope = scope;//chrome.storage.local.getItem(SCOPE_KEY);
    if(ls_scope === scope){
	this.savedTokenTrial = true ;
  var connect_url = 'ws://'+ remove_sharp(kadecot_ip) +':41314/ws';
	this.ws = new WebSocket(
		'ws://'+ remove_sharp(kadecot_ip) +':41314/ws' //?access_token='+ls_token
		, this.protocols);
	this.settingWsCallbacks();
    } else {
	// scope unmatched.
        //chrome.storage.local.removeItem(TOKEN_KEY);
        //chrome.storage.local.removeItem(SCOPE_KEY);
        location.reload() ;
    }

    return this;
  };

  WampClientBrowser.prototype.settingWsCallbacks = function () {
    mylog("[WAMP Client] settingWsCallbacks");
    var self = this;

    this.ws.onopen = function () { self.onOpen.call(self); };
    this.ws.onclose = function (event) { self.onClose.call(self, event); };
    this.ws.onmessage = function (event) { self.receiveMessage.call(self, event); };
    this.ws.onerror = function (error) { self.onError.call(self, error); };

    return ;
  };

  WampClientBrowser.prototype.onOpen = function () {
    mylog("[WAMP Client] websocket connected");
    this.on_open_flag = true;
    var callback;
    callback = wampClientCore.getOpenCallback();
    if( this.savedTokenTrial == true ){
	// Connection success unless disconnected in 1 sec.
	this.savedTokenTrial
		= setTimeout(function(){delete this.savedTokenTrial;},1000) ;
    }

    if(callback != null){
      callback();
    }
    return ;
  };

  WampClientBrowser.prototype.onClose = function () {
    var self = this;
    this.on_open_flag = false;
    mylog("[WAMP Client] websocket disconnected");
    this.ws = null;
    if( this.savedTokenTrial !== undefined ){
	if( typeof this.savedTokenTrial === 'number' )
		clearTimeout(typeof this.savedTokenTrial) ;
	delete typeof this.savedTokenTrial ;
	if( this.numRetry == undefined || this.numRetry < wampConnectRetryNum){
		if( this.numRetry == undefined )	this.numRetry = 1 ;
		else					++this.numRetry ;

		// retry 1 sec later
		setTimeout(function(){
			self.connect(self.url,self.scope) ;
		},1000) ;
		return ;
	} else {
		// Save token (or url-supplied token) is wrong
		//chrome.storage.local.removeItem(TOKEN_KEY);
		//chrome.storage.local.removeItem(SCOPE_KEY);
		if( location.href.indexOf('#')>= 0 ){
			// Remove url-supplied token and reload page
			location.href=location.href.substr(0,location.href.indexOf('#')) ;
			return ;
		} else {
			var redirectTo = "http://" + self.kadecot_ip + ":31413/login.html?redirect_uri="
				+ strip_web_address(location.href) + "%3fkip%3d" + self.kadecot_ip
				+ "&scope=" + self.scope;
			console.log("Redirect to : " + redirectTo);
			location.href = redirectTo ;
		}
	}
    }
    var callback;
    callback = wampClientCore.getCloseCallback();

    if(callback != null){
      callback();
    }

    return ;
  };

  WampClientBrowser.prototype.onError = function (error) {
    mylog("[WAMP Client] websocket error");

    if (this.errorCallback) {
      this.errorCallback(error);
    }
    return ;
  };

  WampClientBrowser.prototype.disconnect = function () {
    mylog("[WAMP Client] websocket disconnecting");
    if (this.ws){
      this.ws.close();
    }

    return this;
  };

  WampClientBrowser.prototype.addOpenCallback = function (callback) {

    //set callback
    wampClientCore.setOpenCallback(callback);

    return ;
  };

  WampClientBrowser.prototype.deleteOpenCallback = function () {

    //set callback
    wampClientCore.deleteOpenCallback();

    return ;
  };

  WampClientBrowser.prototype.addCloseCallback = function (callback) {

    //set callback
    wampClientCore.setcloseCallback(callback);

    return ;
  };

  WampClientBrowser.prototype.deleteCloseCallback = function () {

    //set callback
    wampClientCore.deleteCloseCallback();

    return ;
  };


  WampClientBrowser.prototype.sendHello = function (realm, details, callback) {

    //serialize
    var data;
    data = wampSerializer.createHello(realm, details);

    //encrypt data

    //set callback
    wampClientCore.setHelloCallback(callback);

    //send data
    if(this.on_open_flag){
      this.ws.send(data);
    } else {
      return null;
    }

    return data;
  };

  WampClientBrowser.prototype.sendAuthenticate = function (signature, extra, callback) {

    //serialize
    var data;
    data = wampSerializer.createAuthenticate(signature, extra);

    //encrypt data

    //set callback
    wampClientCore.setAuthenticateCallback(callback);

    //send data
    if(this.on_open_flag){
      this.ws.send(data);
    } else {
      return null;
    }

    return data;
  };

  WampClientBrowser.prototype.sendGoodbye = function (details, reason, callback) {

    //serialize
    var data;
    data = wampSerializer.createGoodbye(details, reason);

    //encrypt data

    //set callback
    wampClientCore.setGoodbyeCallback(callback);

    //send data
    if(this.on_open_flag){
      this.ws.send(data);
    } else {
      return null;
    }

    return data;
  };

  WampClientBrowser.prototype.sendHeartbeat = function (incomingSeq, outgoingSeq, discard) {

    //serialize
    var data;
    data = wampSerializer.createHeartbeat(incomingSeq, outgoingSeq, discard);

    //encrypt data

    //send data
    if(this.on_open_flag){
      this.ws.send(data);
    } else {
      return null;
    }

    return data;
  };

  WampClientBrowser.prototype.sendError = function (type, request, details, error, arguments, argumentsKw) {

    //serialize
    var data;
    data = wampSerializer.createError(type, request, details, error, arguments, argumentsKw);

    //encrypt data

    //send data
    if(this.on_open_flag){
      this.ws.send(data);
    } else {
      return null;
    }

    return data;
  };

  WampClientBrowser.prototype.sendPublish = function (options, topic, arguments, argumentsKw, callback) {

    //serialize
    var data;
    var request;
    request = this.request_id;
    this.request_id++;
    data = wampSerializer.createPublish(request, options, topic, arguments, argumentsKw);

    //encrypt data

    //set callback
    wampClientCore.setPublishCallback(callback, request);

    //send data
    if(this.on_open_flag){
      this.ws.send(data);
    } else {
      return null;
    }

    return data;
  };

  WampClientBrowser.prototype.sendSubscribe = function (options, topic, eventfunc, callback) {

    //serialize
    var data;
    var request;
    request = this.request_id;
    this.request_id++;
    data = wampSerializer.createSubscribe(request, options, topic);

    //encrypt data

    //set callback
    wampClientCore.setSubscribeCallback(callback, request);

    //set event callback
    wampClientCore.setEventCallback(eventfunc, request);

    //send data
    if(this.on_open_flag){
      this.ws.send(data);
    } else {
      return null;
    }

    return data;
  };

  WampClientBrowser.prototype.sendUnsubscribe = function (subscription, callback) {

    //serialize
    var data;
    var request;
    request = this.request_id;
    this.request_id++;
    data = wampSerializer.createUnsubscribe(request, subscription);

    //encrypt data

    //set callback
    wampClientCore.setUnsubscribeCallback(callback, request);

    //set Unsubscribe request id - subscription id
    this.subscription_id_list[request] = subscription;

    //send data
    if(this.on_open_flag){
      this.ws.send(data);
    } else {
      return null;
    }

    return data;
  };

  WampClientBrowser.prototype.sendCall = function (options, procedure, arguments, argumentsKw, callback) {

    //serialize
    var data;
    var request;
    request = this.request_id;
    this.request_id++;
    data = wampSerializer.createCall(request, options, procedure, arguments, argumentsKw);

    //encrypt data

    //set callback
    wampClientCore.setCallCallback(callback, request);

    //send data
    if(this.on_open_flag){
      this.ws.send(data);
    } else {
      return null;
    }

    return data;
  };

  WampClientBrowser.prototype.sendCancel = function (request, options, callback) {

    //serialize
    var data;
    data = wampSerializer.createCancel(request, options);

    //encrypt data

    //set callback
    wampClientCore.setCancelCallback(callback);

    //send data
    if(this.on_open_flag){
      this.ws.send(data);
    } else {
      return null;
    }

    return data;
  };

  WampClientBrowser.prototype.sendRegister = function (options, procedure, callback) {

    //serialize
    var data;
    var request;
    request = this.request_id;
    this.request_id++;
    data = wampSerializer.createRegister(request, options, procedure);

    //encrypt data

    //set callback
    wampClientCore.setRegisterCallback(callback, request);

    //send data
    if(this.on_open_flag){
      this.ws.send(data);
    } else {
      return null;
    }

    return data;
  };

  WampClientBrowser.prototype.sendUnregister = function (registration, callback) {

    //serialize
    var data;
    var request;
    request = this.request_id;
    this.request_id++;
    data = wampSerializer.createUnregister(request, registration);

    //encrypt data

    //set callback
    wampClientCore.setUnregisterCallback(callback, request);

    //send data
    if(this.on_open_flag){
      this.ws.send(data);
    } else {
      return null;
    }

    return data;
  };

  WampClientBrowser.prototype.sendYield = function (request, options, arguments, argumentsKw) {

    //serialize
    var data;
    data = wampSerializer.createYield(request, options, arguments, argumentsKw);

    //encrypt data

    //send data
    if(this.on_open_flag){
      this.ws.send(data);
    }

    return data;
  };


  WampClientBrowser.prototype.addGoodbyeCallback = function (callback) {

    //set callback
    wampClientCore.setGoodbyeCallback(callback);

    return ;
  };

  WampClientBrowser.prototype.deleteGoodbyeCallback = function () {

    //delete callback
    wampClientCore.deleteGoodbyeCallback();

    return ;
  };

  WampClientBrowser.prototype.addHeartbeatCallback = function (callback) {

    //set callback
    wampClientCore.setHeartbeatCallback(callback);

    return ;
  };

  WampClientBrowser.prototype.deleteHeartbeatCallback = function () {

    //delete callback
    wampClientCore.deleteHeartbeatCallback();

    return ;
  };

  WampClientBrowser.prototype.addInvocationCallback = function (request, callback) {

    //set callback
    wampClientCore.setInvocationCallback(callback, request);

    return ;
  };

  WampClientBrowser.prototype.deleteInvocationCallback = function () {

    //delete callback
    wampClientCore.deleteInvocationCallback();

    return ;
  };






  WampClientBrowser.prototype.receiveMessage = function (msg) {

    var data;
    var callback;

    //decrypt data

    //deserialize
    if(msg.data != null){
      data = wampDeserializer.parse(msg.data);
    } else {
      data = wampDeserializer.parse(msg);
    }
    if (data == null) {
      mylog("[wamp perser] Syntax error");
      return;
    }


    switch (data[0]) {
      case WAMP_MSG_TYPE.WELCOME:
      // WAMP SPEC: [WELCOME, Session|id, Details|dict]

        if(this.challenge_flag) {
          this.challenge_flag = false;
          callback = wampClientCore.getAuthenticateCallback();
          if(callback != null){
            callback(data);
          } else {
            mylog("[wamp perser] Callback does not exist.");
          }
        } else {
          callback = wampClientCore.getHelloCallback();

          if(callback != null){
            callback(data);
          } else {
            mylog("[wamp perser] Callback does not exist.");
          }
        }
        break;
        case WAMP_MSG_TYPE.ABORT:
        // WAMP SPEC: [ABORT, Details|dict, Reason|uri]
        if(this.challenge_flag) {
          this.challenge_flag = false;
          callback = wampClientCore.getAuthenticateCallback();
          if(callback != null){
            callback(data);
          } else {
            mylog("[wamp perser] Callback does not exist.");
          }
        } else {
          callback = wampClientCore.getHelloCallback();
          if(callback != null){
            callback(data);
          } else {
            mylog("[wamp perser] Callback does not exist.");
          }
        }
        break;
        case WAMP_MSG_TYPE.CHALLENGE:
        // advanced WAMP SPEC: [CHALLENGE, AuthMethod|string, Extra|dict]
        this.challenge_flag = true;
        callback = wampClientCore.getHelloCallback();
        if(callback != null){
          callback(data);
        } else {
          mylog("[wamp perser] Callback does not exist.");
        }
        break;
        case WAMP_MSG_TYPE.GOODBYE:
        // WAMP SPEC: [GOODBYE, Details|dict, Reason|uri]
        callback = wampClientCore.getGoodbyeCallback();
        if(callback != null){
          callback(data);
        } else {
          mylog("[wamp perser] Callback does not exist.");
        }
        break;
        case WAMP_MSG_TYPE.HEARTBEAT:
        // advanced WAMP SPEC: [AUTHENTICATE, Signature|string, Extra|dict]
        callback = wampClientCore.getHeartbeatCallback();
        if(callback != null){
          callback(data);
        } else {
          mylog("[wamp perser] Callback does not exist.");
        }
        break;
        case WAMP_MSG_TYPE.ERROR:
        // WAMP SPEC: [ERROR, REQUEST.Type|int, REQUEST.Request|id, Details|dict, Error|uri, (Arguments|list, ArgumentsKw|dict)]
        switch(data[1]) {
          case WAMP_MSG_TYPE.SUBSCRIBE:
            // WAMP SPEC: [ERROR, SUBSCRIBE, SUBSCRIBE.Request|id, Details|dict, Error|uri]
            callback = wampClientCore.getSubscribeCallback(data[2]);
            if(callback != null){
              callback(data);
            } else {
              mylog("[wamp perser] Callback does not exist.");
            }
            break;
            case WAMP_MSG_TYPE.UNSUBSCRIBE:
            // WAMP SPEC: [ERROR, UNSUBSCRIBE, UNSUBSCRIBE.Request|id, Details|dict, Error|uri]
            callback = wampClientCore.getUnsubscribeCallback(data[2]);
            if(callback != null){
              callback(data);
            } else {
              mylog("[wamp perser] Callback does not exist.");
            }
            break;
            case WAMP_MSG_TYPE.PUBLISH:
            // WAMP SPEC: [ERROR, PUBLISH, PUBLISH.Request|id, Details|dict, Error|uri]
            callback = wampClientCore.getPublishCallback(data[2]);
            if(callback != null){
              callback(data);
            } else {
              mylog("[wamp perser] Callback does not exist.");
            }
            break;
            case WAMP_MSG_TYPE.INVOCATION:
            // WAMP SPEC: [ERROR, INVOCATION, INVOCATION.Request|id, Details|dict, Error|uri]
            // WAMP SPEC: [ERROR, INVOCATION, INVOCATION.Request|id, Details|dict, Error|uri, Arguments|list]
            // WAMP SPEC: [ERROR, INVOCATION, INVOCATION.Request|id, Details|dict, Error|uri, Arguments|list, ArgumentsKw|dict]
            callback = wampClientCore.getInvocationCallback(data[2]);
            if(callback != null){
              callback(data);
            } else {
              mylog("[wamp perser] Callback does not exist.");
            }
            break;
            case WAMP_MSG_TYPE.CALL:
            // WAMP SPEC: [ERROR, CALL, CALL.Request|id, Details|dict, Error|uri]
            // WAMP SPEC: [ERROR, CALL, CALL.Request|id, Details|dict, Error|uri, Arguments|list]
            // WAMP SPEC: [ERROR, CALL, CALL.Request|id, Details|dict, Error|uri, Arguments|list, ArgumentsKw|dict]
            callback = wampClientCore.getCallCallback(data[2]);
            if(callback != null){
              callback(data);
            } else {
              mylog("[wamp perser] Callback does not exist.");
            }
            break;
            case WAMP_MSG_TYPE.REGISTER:
            // WAMP SPEC: [ERROR, REGISTER, REGISTER.Request|id, Details|dict, Error|uri]
            callback = wampClientCore.getRegisterCallback(data[2]);
            if(callback != null){
              callback(data);
            } else {
              mylog("[wamp perser] Callback does not exist.");
            }
            break;
            case WAMP_MSG_TYPE.UNREGISTER:
            // WAMP SPEC: [ERROR, UNREGISTER, UNREGISTER.Request|id, Details|dict, Error|uri]
            callback = wampClientCore.getUnregisterCallback(data[2]);
            if(callback != null){
              callback(data);
            } else {
              mylog("[wamp perser] Callback does not exist.");
            }
            break;
            default:
            return null;
          }
          break;
          case WAMP_MSG_TYPE.PUBLISHED:
        // WAMP SPEC: [PUBLISHED, PUBLISH.Request|id, Publication|id]
        callback = wampClientCore.getPublishCallback(data[1]);
        if(callback != null){
          callback(data);
        } else {
          mylog("[wamp perser] Callback does not exist.");
        }
        break;
        case WAMP_MSG_TYPE.SUBSCRIBED:
        // WAMP SPEC: [SUBSCRIBED, SUBSCRIBE.Request|id, Subscription|id]
        callback = wampClientCore.getSubscribeCallback(data[1]);
        if(callback != null){
          wampClientCore.setEventCallback(wampClientCore.getEventCallback(data[1]), data[2]);
          wampClientCore.deleteEventCallback(data[1]);
          callback(data);
        } else {
          mylog("[wamp perser] Callback does not exist.");
        }
        break;
        case WAMP_MSG_TYPE.UNSUBSCRIBED:
        // WAMP SPEC: [UNSUBSCRIBED, UNSUBSCRIBE.Request|id]
        callback = wampClientCore.getUnsubscribeCallback(data[1]);
        if(callback != null){
          wampClientCore.deleteEventCallback(this.subscription_id_list[data[1]]);
          callback(data);
        } else {
          mylog("[wamp perser] Callback does not exist.");
        }
        break;
        case WAMP_MSG_TYPE.EVENT:
        // WAMP SPEC: [EVENT, SUBSCRIBED.Subscription|id, PUBLISHED.Publication|id, Details|dict]
        // WAMP SPEC: [EVENT, SUBSCRIBED.Subscription|id, PUBLISHED.Publication|id, Details|dict, PUBLISH.Arguments|list]
        // WAMP SPEC: [EVENT, SUBSCRIBED.Subscription|id, PUBLISHED.Publication|id, Details|dict, PUBLISH.Arguments|list, PUBLISH.ArgumentKw|dict]
        callback = wampClientCore.getEventCallback(data[1]);
        if(callback != null){
          callback(data);
        } else {
          mylog("[wamp perser] Callback does not exist.");
        }
        break;
        case WAMP_MSG_TYPE.RESULT:
        // WAMP SPEC: [RESULT, CALL.Request|id, Details|dict]
        // WAMP SPEC: [RESULT, CALL.Request|id, Details|dict, YIELD.Arguments|list]
        // WAMP SPEC: [RESULT, CALL.Request|id, Details|dict, YIELD.Arguments|list, YIELD.ArgumentsKw|dict]
        callback = wampClientCore.getCallCallback(data[1]);
        if(callback != null){
          callback(data);
        } else {
          mylog("[wamp perser] Callback does not exist.");
        }
        break;
        case WAMP_MSG_TYPE.REGISTERED:
        // WAMP SPEC: [REGISTERED, REGISTER.Request|id, Registration|id]
        callback = wampClientCore.getRegisterCallback(data[1]);
        if(callback != null){
          callback(data);
        } else {
          mylog("[wamp perser] Callback does not exist.");
        }
        break;
        case WAMP_MSG_TYPE.UNREGISTERED:
        // WAMP SPEC: [UNREGISTERED, UNREGISTER.Request|id]
        callback = wampClientCore.getUnregisterCallback(data[1]);
        if(callback != null){
          callback(data);
        } else {
          mylog("[wamp perser] Callback does not exist.");
        }
        break;
        case WAMP_MSG_TYPE.INVOCATION:
        // WAMP SPEC: [INVOCATION, Request|id, REGISTERED.Registration|id, Details|dict]
        // WAMP SPEC: [INVOCATION, Request|id, REGISTERED.Registration|id, Details|dict, CALL.Arguments|list]
        // WAMP SPEC: [INVOCATION, Request|id, REGISTERED.Registration|id, Details|dict, CALL.Arguments|list, CALL.ArgumentsKw|dict]
        callback = wampClientCore.getInvocationCallback(data[1]);
        if(callback != null){
          callback(data);
        } else {
          mylog("[wamp perser] Callback does not exist.");
        }
        break;
        case WAMP_MSG_TYPE.INTERRUPT:
        // advanced WAMP SPEC: [INTERRUPT, INVOCATION.Request|id, Options|dict]
        callback = wampClientCore.getInterruptCallback(data[1]);
        if(callback != null){
          callback(data);
        } else {
          mylog("[wamp perser] Callback does not exist.");
        }
        break;
        default:
        return null;
      }

      return data;


    };


    return WampClientBrowser;

  })();
