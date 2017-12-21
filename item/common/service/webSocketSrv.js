/**
 * Created by NM-029 on 3/23/2017.
 */

(function (module) {
    'use strict';

    var webSocketFactory = function (httpSrv, paraCheckSrv, notificationSrv, userSrv) {
        var privateChatConnect;
        var closedPrivateChatConnectIntented;
        var room;
        var privateChatConnectReconnectTimeOut;
        var publicChatConnect;
        var closedPublicChatConnectIntented;
        var publicChatConnectReconnectTimeOut;

        function connectPrivateChatServer(serverUrl, roomid, receivingMessageCallback, connectionStateCallBack) {
            closedPrivateChatConnectIntented = false;
            var user = userSrv.funcGetUser();

            //消息回调
            var messageListener = function (elem) {
                handleReceivingMessage(elem, receivingMessageCallback);
            }

            //连接状态
            var connectionState = function (state) {
                connectionStateCallBack(state);
            }

            room = roomid;
            var role = user.funcGetIsInMyRoom() ? 1 : 2; //主播为1；用户为2
            var uid = userSrv.funcGetUser().funcGetUid();
            var password = (userSrv.funcGetUser().funcGetPassWord());
            var resourceID = projectVar.opSpace+'_'+projectVar.opTerminal+'_'+projectVar.opVersion+'_' + roomid + '_' + role;
            var name = uid + '@'+projectVar.opProDomain+"/" + resourceID;
            // consoleDebugMessage('name=' + name + " pwd =" + password + ' serverUrl=' + serverUrl);
            newPrivateChatConnect(serverUrl, name, password, messageListener, connectionState);
        }

        function newPrivateChatConnect(serverUrl, name, password, messageListener, connectionState) {
            clearTimeout(privateChatConnectReconnectTimeOut);
            privateChatConnect = new Strophe.Connection(serverUrl);
            privateChatConnect.connect(name, password, function (status) {
                if (Strophe.Status.CONNECTED == status) {
                    privateChatConnect.xmlInput = messageListener;
                    consoleDebugMessage("Openfire建立连接成功！");
                    //发送出席
                    sendPresence(privateChatConnect);
                    // sendEnterRoomMessage();
                } else if (Strophe.Status.DISCONNECTED == status && !closedPrivateChatConnectIntented) {
                    privateChatConnectReconnectTimeOut = setTimeout(function () {
                        newPrivateChatConnect(serverUrl, name, password, messageListener, null);
                    }, 3 * 1000);
                }
                if (connectionState) {
                    connectionState(status);
                }
            });
        }

        function connectPublicChatServer(serverUrl, name,password, receivingMessageCallback, connectionStateCallBack,conectionSuccessCallBack) {
            closedPublicChatConnectIntented = false;
            //消息回调
            var messageListener = function (elem) {
                handleReceivingPublicMessage(elem, receivingMessageCallback);
            }

            //连接状态
            var connectionState = function (state) {
                connectionStateCallBack(state);
            }
            var conectionSuccessCallBackFunction=function()
            {
                conectionSuccessCallBack();
            }
            newPublicChatConnect(serverUrl, name, password, messageListener, connectionState,conectionSuccessCallBackFunction);
        }

        function newPublicChatConnect(serverUrl, name, password, messageListener, connectionState,conectionSuccessCallBack) {
            clearTimeout(publicChatConnectReconnectTimeOut);
            publicChatConnect = new Strophe.Connection(serverUrl);
            publicChatConnect.connect(name, password, function (status) {
                if (Strophe.Status.CONNECTED == status) {
                    publicChatConnect.xmlInput = messageListener;
                    consoleDebugMessage("public chat Openfire建立连接成功！");
                    //发送出席
                    sendPresence(publicChatConnect);
                    //连接成功后回调
                    conectionSuccessCallBack();
                } else if (Strophe.Status.DISCONNECTED == status && !closedPrivateChatConnectIntented) {
                    publicChatConnectReconnectTimeOut = setTimeout(function () {
                        newPublicChatConnect(serverUrl, name, password, messageListener, null);
                    }, 3 * 1000);
                }
                if (connectionState) {
                    connectionState(status);
                }
            });
        }

        /**
         * 处理回调消息
         */
        function handleReceivingMessage(xmlElement, callback) {
            var xmlStr = null,
                fromUid,
                source;
            if (xmlElement !== null && xmlElement.textContent !== null) {
                xmlStr = xmlElement.textContent;
            }
            if (xmlStr === null) {
                return;
            }
            //parse from uid
            if (xmlElement && xmlElement.outerHTML) {
                source = xmlElement.outerHTML;
                fromUid = source.match(/from="(\d*)@/)[1];
            }
            var jsonObj = messageToJson(xmlStr);
            if (!!jsonObj && jsonObj.type != null) {
                if (!jsonObj.hasOwnProperty('fromUid')) {
                    jsonObj.fromUid = fromUid;
                }
                consoleDebugMessage("接收消息:" + jsonObj.type + " " + jsonObj.subtype);
                consoleDebugMessage("消息内容:" + JSON.stringify(jsonObj));
                callback(jsonObj);
                //processMessageByType(jsonObj, callback);
            }
        }

        /**
         * 处理消息内容
         */
        function messageToJson(xmlStr) {
            var browserName = navigator.appName;
            var strDecoded;
            if (browserName == "Microsoft Internet Explorer") {//IE
                strDecoded = regHtml(xmlStr);
            } else {
                strDecoded = $('<textarea/>').html(xmlStr).val();
            }
            var strTrimed = strDecoded.replace("<![CDATA[", "");
            strTrimed = strTrimed.replace("]]>", "");
            var jsonObj;
            if (strTrimed != null && strTrimed.length > 0 && strTrimed.indexOf("{") > -1) {
                try {
                    jsonObj = JSON.parse(strTrimed);
                }
                catch (e) {
                    consoleDebugMessage("json 解析失败 str=" + strTrimed);
                }
            }
            return jsonObj;
        }


        /**
         * 发送出席
         */
        function sendPresence(conn) {
            if (!!conn) {
                consoleDebugMessage("发送出席");
                conn.send($pres());
            }
        }

        /**
         * 发送用户进场消息
         */
        function sendEnterRoomMessage() {
            var user = userSrv.funcGetUser();
            var jsonObj = {};
            jsonObj.type = 104;
            jsonObj.roomid = room;
            jsonObj.uid = user.funcGetUid();
            jsonObj.avatar = user.funcGetAvatar();
            jsonObj.nickname = user.funcGetNickName();
            consoleDebugMessage("发送进场消息！");
            sendMessage(jsonObj);
        }


        function sendChatMessage(message, roomMember, subtype, toUid) {
            var jsonObj = {};
            jsonObj.from_uid = roomMember.uid;
            jsonObj.from_avatar = roomMember.avatar;
            jsonObj.from_nickname = roomMember.nickname;
            jsonObj.type = 107;
            jsonObj.subtype = subtype;
            if (subtype == 2 || subtype == 3) {
                jsonObj.to_uid = toUid;
            }
            jsonObj.text = message;
            jsonObj.roomid = roomMember.roomid;
            jsonObj.uid = roomMember.uid;
            jsonObj.avatar = roomMember.avatar;
            jsonObj.nickname = roomMember.nickname;
            sendMessage(jsonObj);
        }

        function sendMessage(jsonObj, toUid) {
            if (!!privateChatConnect) {
                var jsonStr = $.toJSONString(jsonObj);
                var iq = $msg({type: 'chat', to: toUid + "@openfire.cn"}).c('body', {}).t('' + jsonStr);
                privateChatConnect.send(iq);
                consoleDebugMessage("发送消息:" + jsonStr);
            }
        }

        function sendPublicChatMessage(jsonObj)
        {
            if (!!publicChatConnect) {
                var jsonStr = JSON.stringify(jsonObj);
                var iq = $iq({type: 'set'}).c('request', {xmlns: "jabber:iq:showspace"}).t('<![CDATA[' + jsonStr + ']]>');
                publicChatConnect.send(iq);
                consoleDebugMessage("publicChatConnect 发送消息:" + jsonStr);
            }
        }

        /**
         * 处理回调消息
         */
        function handleReceivingPublicMessage(xmlElement, callback) {
            var xmlStr = null;
            if (xmlElement !== null && xmlElement.textContent !== null) {
                xmlStr = xmlElement.textContent;
            }
            if (xmlStr === null) {
                return;
            }
            var jsonObj = publicMessageToJson(xmlStr);
            if (!!jsonObj && jsonObj.type != null) {
                callback(jsonObj);
            }
        }

        /**
         * 处理消息内容
         */
        function publicMessageToJson(xmlStr) {
            var browserName = navigator.appName;
            var strDecoded;
            if (browserName == "Microsoft Internet Explorer") {//IE
                strDecoded = regHtml(xmlStr);
            } else {
                strDecoded = $('<textarea/>').html(xmlStr).val();
            }
            var strTrimed = strDecoded.replace("<![CDATA[", "");
            strTrimed = strTrimed.replace("]]>", "");
            var jsonObj;
            if (strTrimed != null && strTrimed.length > 0 && strTrimed.indexOf("{") > -1) {
                jsonObj = JSON.parse(strTrimed);
            }
            return jsonObj;
        }

        function isPrivateConnected() {
            return !!privateChatConnect && privateChatConnect.connected;
        }

        function isPublicChatConnected() {
            return !!publicChatConnect && publicChatConnect.connected;
        }

        function disConnectServer() {
            if (privateChatConnect) {
                privateChatConnect.disconnect();
            }
            if(publicChatConnect)
            {
                publicChatConnect.disconnect();
            }
            closedPrivateChatConnectIntented = true;
            closedPublicChatConnectIntented=true;
            consoleDebugMessage("Openfire disconnected!");
        }

        return {
            sendMessage: sendMessage,
            connectServer: connectPrivateChatServer,
            sendChatMessage: sendChatMessage,
            disConnectServer: disConnectServer,
            isConnected: isPrivateConnected,
            sendEnterRoomMessage: sendEnterRoomMessage,
            connectPublicChatServer:connectPublicChatServer,
            isPublicChatConnected:isPublicChatConnected,
            sendPublicChatMessage:sendPublicChatMessage

        }
    };
    module.factory('xsWeb.common.webSocketSrv', ['xsWeb.common.httpSrv', 'xsWeb.common.paraCheckSrv', 'xsWeb.common.notificationSrv', 'xsWeb.common.userSrv', webSocketFactory]);
})(commonModule);

jQuery.extend({
    toJSONString: function (object) {
        var type = typeof object;
        if ('object' == type) {
            if (Array == object.constructor) type = 'array';
            else if (RegExp == object.constructor) type = 'regexp';
            else type = 'object';
        }
        switch (type) {
            case 'undefined':
            case 'unknown':
                return;
            case 'function':
            case 'boolean':
            case 'regexp':
                return object.toString();
            case 'number':
                return isFinite(object) ? object.toString() : 'null';

            case 'string':
                return '"' + object.replace(/(\\|\")/g, "\\$1").replace(/\n|\r|\t/g, function () {
                    var a = arguments[0];
                    return (a == '\n') ? '\\n' : (a == '\r') ? '\\r' : (a == '\t') ? '\\t' : "";
                }) + '"';

            case 'object':
                if (object === null) return 'null';
                var results = [];
                for (var property in object) {
                    var value = jQuery.toJSONString(object[property]);
                    if (value !== undefined) results.push(jQuery.toJSONString(property) + ':' + value);
                }
                return '{' + results.join(',') + '}';
            case 'array':
                var results1 = [];
                for (var i = 0; i < object.length; i++) {
                    var value1 = jQuery.toJSONString(object[i]);
                    if (value1 !== undefined) results1.push(value1);
                }
                return '[' + results1.join(',') + ']';
        }
    }
});
(function () {
    // Create WebSocket connection.
//     const socket = new WebSocket('ws://192.168.84.130:5222');
//
// // Connection opened
//     socket.addEventListener('open', function (event) {
//         socket.send('Hello Server!');
//     });
//
// // Listen for messages
//     socket.addEventListener('message', function (event) {
//         console.log('Message from server', event.data);
//     });
})();

function consoleDebugMessage(message) {
    //console.log(message);
}

/**
 * 收到的私信会可能会包含除body外的其它内容，这些内容会导致JSON解析出错，所以要去掉
 * 这个函数在 strophe.js的 _onMessage中调用
 * @param msg
 * @returns {*}
 */
function funcReplaceInvalidChat(msg) {
    //手机发送过来的私信
    /**
     "<message xmlns="jabber:client" id="voA10-64" to="196@of1" from="220@of1/showself_A_1.8.1" type="chat">
     <body>
     {"sysdateline":1490950136166,"message":"bbbbbbbbbb","type":1,"to":196,"latitude":33,"longitude":33,"name":"大使1OggzjyRc","avatar":"http://pics.showself.com/upload_pics/operation/avatar/sys_04.jpg","url":"",
     "relaton":0,"dateline":1490950136,"gender":1,"duration":0,"thumburl":"","giftnote":"","_seq":"2347"}
     </body>
     <thread>TduOC22</thread>
     <subject>2347</subject>
     </message>"
     */
    var tmp = msg.toString();
    var msgStr = tmp.replace(/<thread>([\w:-]+)<\/thread>/, '').replace(/<subject>([\w:-]+)<\/subject>/, '');
    return msgStr;

}