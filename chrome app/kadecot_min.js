function mylog(e){}function WampClientManager(){function e(){mylog("[WAMP Client] control panel connected"),this.on_hello_welcomed=!1;var e;e=i.getOpenCallback(),null!=e&&e()}function t(){mylog("[WAMP Client] websocket disconnected"),!this.on_hello_welcomed;var e;e=i.getCloseCallback(),null!=e&&e(),this.on_hello_welcomed&&void 0!=this.disconnected_callback&&this.disconnected_callback()}function n(e){this.errorCallback&&this.errorCallback(e)}function l(e){var t,n;if(void 0==e.data&&null==e.data||(e=e.data),t=c.parse(e),null==t)return void mylog("[wamp perser] Syntax error : "+e);switch(mylog(e),t[0]){case WAMP_MSG_TYPE.WELCOME:this.challnge_flag?(this.challnge_flag=!1,n=i.getAuthenticateCallback(),null!=n?n(t):mylog("[wamp perser] Callback does not exist.")):(n=i.getHelloCallback(),null!=n?n(t):mylog("[wamp perser] Callback does not exist."));break;case WAMP_MSG_TYPE.ABORT:this.challnge_flag?(this.challnge_flag=!1,n=i.getAuthenticateCallback(),null!=n?n(t):mylog("[wamp perser] Callback does not exist.")):(n=i.getHelloCallback(),null!=n?n(t):mylog("[wamp perser] Callback does not exist."));break;case WAMP_MSG_TYPE.CHALLENGE:this.challnge_flag=!0,n=i.getHelloCallback(),null!=n?n(t):mylog("[wamp perser] Callback does not exist.");break;case WAMP_MSG_TYPE.GOODBYE:n=i.getGoodbyeCallback(),null!=n?n(t):mylog("[wamp perser] Callback does not exist.");break;case WAMP_MSG_TYPE.HEARTBEAT:n=i.getHeartbeatCallback(),null!=n?n(t):mylog("[wamp perser] Callback does not exist.");break;case WAMP_MSG_TYPE.ERROR:switch(t[1]){case WAMP_MSG_TYPE.SUBSCRIBE:n=i.getSubscribeCallback(t[2]),null!=n?n(t):mylog("[wamp perser] Callback does not exist.");break;case WAMP_MSG_TYPE.UNSUBSCRIBE:n=i.getUnsubscribeCallback(t[2]),null!=n?n(t):mylog("[wamp perser] Callback does not exist.");break;case WAMP_MSG_TYPE.PUBLISH:n=i.getPublishCallback(t[2]),null!=n?n(t):mylog("[wamp perser] Callback does not exist.");break;case WAMP_MSG_TYPE.INVOCATION:n=i.getInvocationCallback(t[2]),null!=n?n(t):mylog("[wamp perser] Callback does not exist.");break;case WAMP_MSG_TYPE.CALL:n=i.getCallCallback(t[2]),null!=n?n(t):mylog("[wamp perser] Callback does not exist.");break;case WAMP_MSG_TYPE.REGISTER:n=i.getRegisterCallback(t[2]),null!=n?n(t):mylog("[wamp perser] Callback does not exist.");break;case WAMP_MSG_TYPE.UNREGISTER:n=i.getUnregisterCallback(t[2]),null!=n?n(t):mylog("[wamp perser] Callback does not exist.");break;default:return null}break;case WAMP_MSG_TYPE.PUBLISHED:n=i.getPublishCallback(t[1]),null!=n?n(t):mylog("[wamp perser] Callback does not exist.");break;case WAMP_MSG_TYPE.SUBSCRIBED:n=i.getSubscribeCallback(t[1]),i.setEventCallback(i.getEventCallback(t[1]),t[2]),null!=n?n(t):mylog("[wamp perser] Callback does not exist.");break;case WAMP_MSG_TYPE.UNSUBSCRIBED:n=i.getUnsubscribeCallback(t[1]),i.deleteEventCallback(this.subscription_id_list[t[1]]),null!=n?n(t):mylog("[wamp perser] Callback does not exist.");break;case WAMP_MSG_TYPE.EVENT:n=i.getEventCallback(t[1]),null!=n?n(t):mylog("[wamp perser] Callback does not exist.");break;case WAMP_MSG_TYPE.RESULT:n=i.getCallCallback(t[1]),null!=n?n(t):mylog("[wamp perser] Callback does not exist.");break;case WAMP_MSG_TYPE.REGISTERED:n=i.getRegisterCallback(t[1]),null!=n?n(t):mylog("[wamp perser] Callback does not exist.");break;case WAMP_MSG_TYPE.UNREGISTERED:n=i.getUnregisterCallback(t[1]),null!=n?n(t):mylog("[wamp perser] Callback does not exist.");break;case WAMP_MSG_TYPE.INVOCATION:n=i.getInvocationCallback(t[1]),null!=n?n(t):mylog("[wamp perser] Callback does not exist.");break;case WAMP_MSG_TYPE.INTERRUPT:n=i.getInterruptCallback(t[1]),null!=n?n(t):mylog("[wamp perser] Callback does not exist.");break;default:return null}return t}function r(e,t){return"com.sonycsl.kadecot."+e+".procedure."+t+"."}var a=this;this.protocols=["wamp.2.json"],this.request_id=1,this.subscription_id_list=[];var o=new WampSerializer,c=new WampDeserializer,i=new WampClientCore;this.addOpenCallback=function(e){i.setOpenCallback(e)},this.setErrorCallback=function(e){a.errorCallback=e},this.deleteOpenCallback=function(){i.deleteOpenCallback()},this.addCloseCallback=function(e){i.setcloseCallback(e)},this.deleteCloseCallback=function(){i.deleteCloseCallback()},this.sendHello=function(e,t,n){var l,r=this;l=o.createHello(e,t),i.setHelloCallback(function(){r.on_hello_welcomed=!0,n.apply(this,arguments)}),a.WampClientTransport.send(l)},this.sendAuthenticate=function(e,t,n){var l;l=o.createAuthenticate(e,t),i.setAuthenticateCallback(n),a.WampClientTransport.send(l)},this.sendGoodbye=function(e,t,n){var l;l=o.createGoodbye(e,t),i.setGoodbyeCallback(n),a.WampClientTransport.send(l)},this.sendHeartbeat=function(e,t,n){var l;l=o.createHeartbeat(e,t,n),a.WampClientTransport.send(l)},this.sendError=function(e,t,n,l,arguments,r){var c;c=o.createError(e,t,n,l,arguments,r),a.WampClientTransport.send(c)},this.sendPublish=function(e,t,arguments,n,l){var r,c;c=this.request_id,this.request_id++,r=o.createPublish(c,e,t,arguments,n),i.setPublishCallback(l,c),a.WampClientTransport.send(r)},this.sendSubscribe=function(e,t,n,l){var r,c;c=this.request_id,this.request_id++,r=o.createSubscribe(c,e,t),i.setSubscribeCallback(l,c),i.setEventCallback(n,c),a.WampClientTransport.send(r)},this.sendUnsubscribe=function(e,t){var n,l;l=this.request_id,this.request_id++,n=o.createUnsubscribe(l,e),i.setUnsubscribeCallback(t,l),this.subscription_id_list[l]=e,a.WampClientTransport.send(n)},this.sendCall=function(e,t,arguments,n,l){var r,c;c=this.request_id,this.request_id++,r=o.createCall(c,e,t,arguments,n),i.setCallCallback(l,c),a.WampClientTransport.send(r)},this.sendCancel=function(e,t,n){var l;l=o.createCancel(e,t),i.setCancelCallback(n),a.WampClientTransport.send(l)},this.sendRegister=function(e,t,n){var l,r;r=this.request_id,this.request_id++,l=o.createRegister(r,e,t),i.setRegisterCallback(n,r),a.WampClientTransport.send(l)},this.sendUnregister=function(e,t){var n,l;l=this.request_id,this.request_id++,n=o.createUnregister(l,e),i.setUnregisterCallback(t,l),a.WampClientTransport.send(n)},this.sendYield=function(e,t,arguments,n){var l;l=o.createYield(e,t,arguments,n),a.WampClientTransport.send(l)},this.addGoodbyeCallback=function(e){i.setGoodbyeCallback(e)},this.deleteGoodbyeCallback=function(){i.deleteGoodbyeCallback()},this.addHeartbeatCallback=function(e){i.setHeartbeatCallback(e)},this.deleteHeartbeatCallback=function(){i.deleteHeartbeatCallback()},this.addInvocationCallback=function(e,t){i.setInvocationCallback(t,e)},this.deleteInvocationCallback=function(){i.deleteInvocationCallback()};var u;this.connect=function(r,o,c,i){a.connected_callback=c,a.disconnected_callback=i,a.addOpenCallback(function(){a.sendHello("default",{roles:{caller:{},subscriber:{}},manifest:o},function(){a.sendCall({},"com.sonycsl.kadecot.provider.procedure.getDeviceList",null,null,function(e){u=e[4].deviceList,c(e[4].deviceList,a)})})}),a.setErrorCallback(function(e){void 0!==i&&i()}),void 0===r&&(r="com.sonycsl.kadecot",console.log("[WAMP Client] WARNING:The access scope is automatically set to "+r)),a.scope=r,console.log("[WAMP Client] connecting to control panel"),a.WampClientTransport.open({scope:r,onopen:function(){e.call(a)},onclose:function(e){t.call(a,e)},onmessage:function(e){l.call(a,e)},onerror:function(e){n.call(a,e)}})},this.disconnect=function(){return mylog("[WAMP Client] control panel disconnecting"),a.WampClientTransport.close(),this},this.callJSONStyle=function(e,t,n){function l(t){var l,r=o.indexOf(t);return r>=0?(l=o.substring(0,r),o=o.substring(r+t.length)):n("Illegal JSONP url:"+e),l}var a=this;"function"!=typeof n&&(n=function(e){console.log(e)});var o=decodeURIComponent(e),c=l("jsonp/v1/devices/");if(void 0!=c){var i=l("?");if(void 0!=i){if(i=parseInt(i),void 0==u)return void n("No device list is cached.");var s;if(u.forEach(function(e){e.deviceId==i&&(s=e)}),void 0==s)return void n("No device found for id "+i);var p={},f=o.split("&");return f.forEach(function(e){var t=e.split("=");2==t.length&&(p[t[0]]=t[1])}),void 0==p.procedure?void n("No procedure found in jsonp url:"+e):(p.params=void 0==p.params?{}:JSON.parse(p.params),void a.sendCall({deviceId:i},r(s.protocol,s.deviceType)+p.procedure,[],p.params,t))}}}}function kadecot_init(e){function t(t){var n=new WampClientManager;n.WampClientTransport={open:function(e){window.addEventListener("message",function(t){e.onmessage(t.data)},!1),e.onopen()},send:function(e){t.postMessage(e,"*")},close:function(){}},n.connect(e.scope,e.manifest,e.onconnect,e.ondisconnect)}function n(t,n){if(void 0==n)return void(location.href="http://"+t+":31413/login.html?redirect_uri="+location.protocol+"//"+location.host+location.pathname+encodeURIComponent(location.search)+"&scope="+e.scope);var l,r,a=new WampClientManager;a.WampClientTransport={open:function(e){r=e,l=new WebSocket("ws://"+t+":41314?access_token="+n,["wamp.2.json"]),l.onopen=function(){r.onopen()},l.onerror=function(e){r.onerror(e)},l.onmessage=function(e){r.onmessage(e.data)}},send:function(e){l.send(e)},close:function(e){r.onclose(e)}},a.connect(e.scope,e.manifest,e.onconnect,e.ondisconnect)}if("function"==typeof e&&(e={onconnect:e}),"string"!=typeof e.scope&&(e.scope="com.sonycsl.kadecot"),"function"!=typeof e.onconnect)return void alert("kadecot_init : onconnect callback should be specified!");"function"!=typeof e.ondisconnect&&(e.ondisconnect=function(){});var l={};if(location.search.length>0){var r,a=location.href.indexOf("#");a>=0&&(r=location.href.substring(a+1));var o=location.search.split(/[\?&]/);o.forEach(function(e){var t=e.split("=");t.length<2||(l[t[0]]=t[1])}),l._token=r}void 0!=l.k?"https:"===location.protocol?alert("Cannot establish local Kadecot connection from https: site, because local connection is less secure ws: connection (instead of wss:)"):n(l.k,l._token):window.parent!=window?t(window.parent):alert("This app can run only in local connection mode or in cloud connection mode in hems.gallery.")}var ArgumentNullException=function(){},WAMP_MSG_TYPE={HELLO:1,WELCOME:2,ABORT:3,CHALLENGE:4,AUTHENTICATE:5,GOODBYE:6,HEARTBEAT:7,ERROR:8,PUBLISH:16,PUBLISHED:17,SUBSCRIBE:32,SUBSCRIBED:33,UNSUBSCRIBE:34,UNSUBSCRIBED:35,EVENT:36,CALL:48,CANCEL:49,RESULT:50,REGISTER:64,REGISTERED:65,UNREGISTER:66,UNREGISTERED:67,INVOCATION:68,INTERRUPT:69,YIELD:70},WampClientCore=function(){var e=function(){this.openCallback={func:null},this.closeCallback={func:null},this.helloCallback={func:null},this.authenticateCallback={func:null},this.goodbyeCallback={func:null},this.heartbeatCallback={func:null},this.publishCallback={func:[]},this.subscribeCallback={func:[]},this.unsubscribeCallback={func:[]},this.callCallback={func:[]},this.cancelCallback={func:[]},this.registerCallback={func:[]},this.unregisterCallback={func:[]},this.eventCallback={func:[]},this.invocationCallback={func:[]},this.interruptCallback={func:[]}};return e.prototype.setOpenCallback=function(e){return this.openCallback.func=e,0},e.prototype.getOpenCallback=function(){return this.openCallback.func},e.prototype.setcloseCallback=function(e){return this.closeCallback.func=e,0},e.prototype.getCloseCallback=function(){return this.closeCallback.func},e.prototype.setHelloCallback=function(e){return this.helloCallback.func=e,0},e.prototype.getHelloCallback=function(){return this.helloCallback.func},e.prototype.setAuthenticateCallback=function(e){return this.authenticateCallback.func=e,0},e.prototype.getAuthenticateCallback=function(){return this.authenticateCallback.func},e.prototype.setGoodbyeCallback=function(e){return this.goodbyeCallback.func=e,0},e.prototype.deleteGoodbyeCallback=function(){return this.goodbyeCallback.func=null,0},e.prototype.getGoodbyeCallback=function(){return this.goodbyeCallback.func},e.prototype.setHeartbeatCallback=function(e){return this.heartbeatCallback.func=e,0},e.prototype.deleteHeartbeatCallback=function(){return this.heartbeatCallback.func=null,0},e.prototype.getHeartbeatCallback=function(){return this.heartbeatCallback.func},e.prototype.setPublishCallback=function(e,t){return this.publishCallback.func[t]=e,0},e.prototype.getPublishCallback=function(e){return this.publishCallback.func[e]},e.prototype.setSubscribeCallback=function(e,t){return this.subscribeCallback.func[t]=e,0},e.prototype.getSubscribeCallback=function(e){return this.subscribeCallback.func[e]},e.prototype.setUnsubscribeCallback=function(e,t){return this.unsubscribeCallback.func[t]=e,0},e.prototype.getUnsubscribeCallback=function(e){return this.unsubscribeCallback.func[e]},e.prototype.setCallCallback=function(e,t){return this.callCallback.func[t]=e,0},e.prototype.getCallCallback=function(e){return this.callCallback.func[e]},e.prototype.setCancelCallback=function(e,t){return this.cancelCallback.func[t]=e,0},e.prototype.getCancelCallback=function(e){return this.cancelCallback.func[e]},e.prototype.setRegisterCallback=function(e,t){return this.registerCallback.func[t]=e,0},e.prototype.getRegisterCallback=function(e){return this.registerCallback.func[e]},e.prototype.setUnregisterCallback=function(e,t){return this.unregisterCallback.func[t]=e,0},e.prototype.getUnregisterCallback=function(e){return this.unregisterCallback.func[e]},e.prototype.setEventCallback=function(e,t){return this.eventCallback.func[t]=e,0},e.prototype.deleteEventCallback=function(e){return this.eventCallback.func[e]=null,0},e.prototype.getEventCallback=function(e){return this.eventCallback.func[e]},e.prototype.setInvocationCallback=function(e,t){return this.invocationCallback.func[t]=e,0},e.prototype.deleteInvocationCallback=function(e){return this.invocationCallback.func[e]=null,0},e.prototype.getInvocationCallback=function(e){return this.invocationCallback.func[e]},e.prototype.setInterruptCallback=function(e,t){return this.interruptCallback.func[t]=e,0},e.prototype.deleteInterruptCallback=function(e){return this.interruptCallback.func[e]=null,0},e.prototype.getInterruptCallback=function(e){return this.interruptCallback.func[e]},e}(),WampSerializer=function(){var e=function(){};return e.prototype.createHello=function(e,t){var n;if(!e)throw new ArgumentNullException;if(!t)throw new ArgumentNullException;return n=JSON.stringify([WAMP_MSG_TYPE.HELLO,e,t]),mylog("[wamp][HELLO] "+n),n},e.prototype.createWelcome=function(e,t){var n;if(!e)throw new ArgumentNullException;if(!t)throw new ArgumentNullException;return n=JSON.stringify([WAMP_MSG_TYPE.WELCOME,e,t]),mylog("[wamp][WELCOME] "+n),n},e.prototype.createAbort=function(e,t){var n;if(!e)throw new ArgumentNullException;if(!t)throw new ArgumentNullException;return n=JSON.stringify([WAMP_MSG_TYPE.ABORT,e,t]),mylog("[wamp][ABORT] "+n),n},e.prototype.createChallenge=function(e,t){var n;if(!e)throw new ArgumentNullException;if(!t)throw new ArgumentNullException;return n=JSON.stringify([WAMP_MSG_TYPE.CHALLENGE,e,t]),mylog("[wamp][CHALLENGE] "+n),n},e.prototype.createAuthenticate=function(e,t){var n;if(!e)throw new ArgumentNullException;if(!t)throw new ArgumentNullException;return n=JSON.stringify([WAMP_MSG_TYPE.AUTHENTICATE,e,t]),mylog("[wamp][AUTHENTICATE] "+n),n},e.prototype.createGoodbye=function(e,t){var n;if(!e)throw new ArgumentNullException;if(!t)throw new ArgumentNullException;return n=JSON.stringify([WAMP_MSG_TYPE.GOODBYE,e,t]),mylog("[wamp][GOODBYE] "+n),n},e.prototype.createHeartbeat=function(e,t,n){var l;if(!e)throw new ArgumentNullException;if(!t)throw new ArgumentNullException;return l=null==n?JSON.stringify([WAMP_MSG_TYPE.HEARTBEAT,e,t]):JSON.stringify([WAMP_MSG_TYPE.HEARTBEAT,e,t,n]),mylog("[wamp][HEARTBEAT] "+l),l},e.prototype.createError=function(e,t,n,l,arguments,r){var a;if(!e)throw new ArgumentNullException;if(!t)throw new ArgumentNullException;if(!n)throw new ArgumentNullException;if(!l)throw new ArgumentNullException;return a=null==arguments&&null==r?JSON.stringify([WAMP_MSG_TYPE.ERROR,e,t,n,l]):null!=arguments&&null==r?JSON.stringify([WAMP_MSG_TYPE.ERROR,e,t,n,l,arguments]):JSON.stringify([WAMP_MSG_TYPE.ERROR,e,t,n,l,arguments,r]),mylog("[wamp][ERROR] "+a),a},e.prototype.createPublish=function(e,t,n,arguments,l){var r;if(!e)throw new ArgumentNullException;if(!t)throw new ArgumentNullException;if(!n)throw new ArgumentNullException;return r=null==arguments&&null==l?JSON.stringify([WAMP_MSG_TYPE.PUBLISH,e,t,n]):null!=arguments&&null==l?JSON.stringify([WAMP_MSG_TYPE.PUBLISH,e,t,n,arguments]):JSON.stringify([WAMP_MSG_TYPE.PUBLISH,e,t,n,arguments,l]),mylog("[wamp][PUBLISH] "+r),r},e.prototype.createPublished=function(e,t){var n;if(!e)throw new ArgumentNullException;if(!t)throw new ArgumentNullException;return n=JSON.stringify([WAMP_MSG_TYPE.PUBLISHED,e,t]),mylog("[wamp][PUBLISHED] "+n),n},e.prototype.createSubscribe=function(e,t,n){var l;if(!e)throw new ArgumentNullException;if(!t)throw new ArgumentNullException;if(!n)throw new ArgumentNullException;return l=JSON.stringify([WAMP_MSG_TYPE.SUBSCRIBE,e,t,n]),mylog("[wamp][SUBSCRIBE] "+l),l},e.prototype.createSubscribed=function(e,t){var n;if(!e)throw new ArgumentNullException;if(!t)throw new ArgumentNullException;return n=JSON.stringify([WAMP_MSG_TYPE.SUBSCRIBED,e,t]),mylog("[wamp][SUBSCRIBED] "+n),n},e.prototype.createUnsubscribe=function(e,t){var n;if(!e)throw new ArgumentNullException;if(!t)throw new ArgumentNullException;return n=JSON.stringify([WAMP_MSG_TYPE.UNSUBSCRIBE,e,t]),mylog("[wamp][UNSUBSCRIBE] "+n),n},e.prototype.createUnsubscribed=function(e){var t;if(!e)throw new ArgumentNullException;return t=JSON.stringify([WAMP_MSG_TYPE.UNSUBSCRIBED,e]),mylog("[wamp][UNSUBSCRIBED] "+t),t},e.prototype.createEvent=function(e,t,n,arguments,l){var r;if(!e)throw new ArgumentNullException;if(!t)throw new ArgumentNullException;if(!n)throw new ArgumentNullException;return r=null==arguments&&null==l?JSON.stringify([WAMP_MSG_TYPE.EVENT,e,t,n]):null!=arguments&&null==l?JSON.stringify([WAMP_MSG_TYPE.EVENT,e,t,n,arguments]):JSON.stringify([WAMP_MSG_TYPE.EVENT,e,t,n,arguments,l]),mylog("[wamp][EVENT] "+r),r},e.prototype.createCall=function(e,t,n,arguments,l){var r;if(!e)throw new ArgumentNullException;if(!t)throw new ArgumentNullException;if(!n)throw new ArgumentNullException;return r=null==arguments&&null==l?JSON.stringify([WAMP_MSG_TYPE.CALL,e,t,n]):null!=arguments&&null==l?JSON.stringify([WAMP_MSG_TYPE.CALL,e,t,n,arguments]):JSON.stringify([WAMP_MSG_TYPE.CALL,e,t,n,arguments,l]),mylog("[wamp][CALL] "+r),r},e.prototype.createCancel=function(e,t){var n;if(!e)throw new ArgumentNullException;if(!t)throw new ArgumentNullException;return n=JSON.stringify([WAMP_MSG_TYPE.CANCEL,e,t]),mylog("[wamp][CANCEL] "+n),n},e.prototype.createResult=function(e,t,arguments,n){var l;if(!e)throw new ArgumentNullException;if(!t)throw new ArgumentNullException;return l=null==arguments&&null==n?JSON.stringify([WAMP_MSG_TYPE.RESULT,e,t]):null!=arguments&&null==n?JSON.stringify([WAMP_MSG_TYPE.RESULT,e,t,arguments]):JSON.stringify([WAMP_MSG_TYPE.RESULT,e,t,arguments,n]),mylog("[wamp][RESULT] "+l),l},e.prototype.createRegister=function(e,t,n){var l;if(!e)throw new ArgumentNullException;if(!t)throw new ArgumentNullException;if(!n)throw new ArgumentNullException;return l=JSON.stringify([WAMP_MSG_TYPE.REGISTER,e,t,n]),mylog("[wamp][REGISTER] "+l),l},e.prototype.createRegistered=function(e,t){var n;if(!e)throw new ArgumentNullException;if(!t)throw new ArgumentNullException;return n=JSON.stringify([WAMP_MSG_TYPE.REGISTERED,e,t]),mylog("[wamp][REGISTERED] "+n),n},e.prototype.createUnregister=function(e,t){var n;if(!e)throw new ArgumentNullException;if(!t)throw new ArgumentNullException;return n=JSON.stringify([WAMP_MSG_TYPE.UNREGISTER,e,t]),mylog("[wamp][UNREGISTER] "+n),n},e.prototype.createUnregistered=function(e){var t;if(!e)throw new ArgumentNullException;return t=JSON.stringify([WAMP_MSG_TYPE.UNREGISTERED,e]),mylog("[wamp][UNREGISTERED] "+t),t},e.prototype.createInvocation=function(e,t,n,arguments,l){var r;if(!e)throw new ArgumentNullException;if(!t)throw new ArgumentNullException;if(!n)throw new ArgumentNullException;return r=null==arguments&&null==l?JSON.stringify([WAMP_MSG_TYPE.INVOCATION,e,t,n]):null!=arguments&&null==l?JSON.stringify([WAMP_MSG_TYPE.INVOCATION,e,t,n,arguments]):JSON.stringify([WAMP_MSG_TYPE.INVOCATION,e,t,n,arguments,l]),mylog("[wamp][INVOCATION] "+r),r},e.prototype.createInterrupt=function(e,t){var n;if(!e)throw new ArgumentNullException;if(!t)throw new ArgumentNullException;return n=JSON.stringify([WAMP_MSG_TYPE.INTERRUPT,e,t]),mylog("[wamp][INTERRUPT] "+n),n},e.prototype.createYield=function(e,t,arguments,n){var l;if(!e)throw new ArgumentNullException;if(!t)throw new ArgumentNullException;return l=null==arguments&&null==n?JSON.stringify([WAMP_MSG_TYPE.YIELD,e,t]):null!=arguments&&null==n?JSON.stringify([WAMP_MSG_TYPE.YIELD,e,t,arguments]):JSON.stringify([WAMP_MSG_TYPE.YIELD,e,t,arguments,n]),mylog("[wamp][YIELD] "+l),l},e}(),WampDeserializer=function(){var e=function(){};return e.prototype.parse=function(e){var t;if(!e)throw new ArgumentNullException;if(mylog("[wamp perser] message received",e),t=JSON.parse(e),!(t instanceof Array)||t.length<2)return null;switch(t[0]){case WAMP_MSG_TYPE.HELLO:if(t.length<3)return null;break;case WAMP_MSG_TYPE.WELCOME:if(t.length<3)return null;break;case WAMP_MSG_TYPE.ABORT:if(t.length<3)return null;break;case WAMP_MSG_TYPE.CHALLENGE:if(t.length<3)return null;break;case WAMP_MSG_TYPE.AUTHENTICATE:if(t.length<3)return null;break;case WAMP_MSG_TYPE.GOODBYE:if(t.length<3)return null;break;case WAMP_MSG_TYPE.HEARTBEAT:if(t.length<3)return null;break;case WAMP_MSG_TYPE.ERROR:if(t.length<5)return null;switch(t[1]){case WAMP_MSG_TYPE.GOODBYE:case WAMP_MSG_TYPE.YIELD:case WAMP_MSG_TYPE.ERROR:case WAMP_MSG_TYPE.SUBSCRIBE:case WAMP_MSG_TYPE.UNSUBSCRIBE:case WAMP_MSG_TYPE.PUBLISH:case WAMP_MSG_TYPE.INVOCATION:case WAMP_MSG_TYPE.CALL:break;case WAMP_MSG_TYPE.REGISTER:case WAMP_MSG_TYPE.UNREGISTER:break;default:return null}break;case WAMP_MSG_TYPE.PUBLISH:if(t.length<4)return null;break;case WAMP_MSG_TYPE.PUBLISHED:if(t.length<3)return null;break;case WAMP_MSG_TYPE.SUBSCRIBE:if(t.length<4)return null;break;case WAMP_MSG_TYPE.SUBSCRIBED:if(t.length<3)return null;break;case WAMP_MSG_TYPE.UNSUBSCRIBE:if(t.length<3)return null;break;case WAMP_MSG_TYPE.UNSUBSCRIBED:if(t.length<2)return null;break;case WAMP_MSG_TYPE.EVENT:if(t.length<4)return null;break;case WAMP_MSG_TYPE.CALL:if(t.length<4)return null;break;case WAMP_MSG_TYPE.CANCEL:if(t.length<3)return null;break;case WAMP_MSG_TYPE.RESULT:if(t.length<3)return null;break;case WAMP_MSG_TYPE.REGISTER:if(t.length<4)return null;break;case WAMP_MSG_TYPE.REGISTERED:if(t.length<3)return null;break;case WAMP_MSG_TYPE.UNREGISTER:if(t.length<3)return null;break;case WAMP_MSG_TYPE.UNREGISTERED:if(t.length<2)return null;break;case WAMP_MSG_TYPE.INVOCATION:if(t.length<4)return null;break;case WAMP_MSG_TYPE.INTERRUPT:if(t.length<3)return null;break;case WAMP_MSG_TYPE.YIELD:if(t.length<3)return null;break;default:return null}return t},e}(),ArgumentNullException=function(){};