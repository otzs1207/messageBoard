/**
 * Created by longkf on 2016/1/19.
 */
var XSH5Utils = {

    getRequestValidConfigString : function () {
        var enmoliParamter = new EnmoliParamter();
        return enmoliParamter.ayz("showself_h5_XSH5Utils", "showselfAnchorVisitorParameters");
    },

    convertSecondToHourAndMinutes:function(sencond){
    var returnTime="";
    if (null == sencond || ""==sencond) {
        return "0";
    }
    var s = parseInt(sencond);
    var N =parseInt( s / 3600);
    if (N > 0){
        returnTime+=N + "小时";
    }
    s = s % 3600;
    var K = parseInt(s / 60);
    if (K >= 0){
        if(K==0){
            returnTime+="1分钟";
        }else{
            returnTime+=K + "分钟";
        }
    }
    returnTime+="前";

    return returnTime;
    },
    encryptByDES: function (message, key) {
        if (!key) {
            key = this.getRequestValidConfigString();
        }
        var keyHex = CryptoJS.enc.Utf8.parse(key);
        var encrypted = CryptoJS.DES.encrypt(message, keyHex, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        });
        return encrypted.toString();
    },

    decryptByDES: function (ciphertext, key) {
        if (!key) {
            key = this.getRequestValidConfigString();
        }
        var keyHex = CryptoJS.enc.Utf8.parse(key);
        // direct decrypt ciphertext
        var decrypted = CryptoJS.DES.decrypt({
            ciphertext: CryptoJS.enc.Base64.parse(ciphertext)
        }, keyHex, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        });
        return decrypted.toString(CryptoJS.enc.Utf8);
    },

    decryptResponse : function (ciphertext) {
        return this.decryptByDES(ciphertext, rk);
    },

    isMobile : function() {
        var sUserAgent = navigator.userAgent.toLowerCase();
        var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
        var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
        var bIsMidp = sUserAgent.match(/midp/i) == "midp";
        var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
        var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
        var bIsAndroid = sUserAgent.match(/android/i) == "android";
        var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
        var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
        if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {
            return true;
        } else {
            return false;
        }
    },

    getRandomStr : function() {
        var d = new Date().getTime();
        var uuid = 'xxxxxxxxxxxxxxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = (d + Math.random()*16)%16 | 0;
            d = Math.floor(d/16);
            return (c=='x' ? r : (r&0x7|0x8)).toString(16);
        });
        return uuid;
    },

    getQueryParameter : function(key) {
        var s = window.location.href.split("?")[1];
        if (!!s) {
            var params = s.split("&");
            for (index in params) {
                var param =  params[index].split("=");
                if (param[0].toLowerCase() == key.toLowerCase()) {
                    return param[1];
                }
            }
        }
    },
    /**
     * mobile phone number check
     *
     * return false: check fail; true check pass
     */
    funcPhoneNumCheck : function(phoneNum){
        if(!phoneNum){
            return false;
        }
        var telReg = phoneNum.match(/^(0|86|17951)?(13[0-9]|15[012356789]|17[0-9]|18[0-9]|14[57])[0-9]{8}$/);
        if (telReg == null) {
            return false;
        }
        return true;
    },

    /**
     * ID card No check
     * @param id
     * @returns {boolean}
     */
    funcIDcardNoCheck : function(id){
        if(!id){
            return false;
        }
        //15位数身份证正则表达式
        var arg1 = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$/;
        //18位数身份证正则表达式
        var arg2 = /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[A-Z])$/;
        if (id.match(arg1) == null && ((id.match(arg2)==null)||(id.toUpperCase().match(arg2)==null))) {
            return false;
        }
        return true;
    }
    ,
    funcRandomStr:function(len)
    {
        len = len || 32;
        var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
        var maxPos = $chars.length;
        var pwd = '';
        for (var i = 0; i < len; i++) {
            pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
        }
        return pwd;
    },
    funcIsChinese:function(chinese){
        if(!chinese){
            return false;
        }
        var nameMatch = chinese.match(/[\u4e00-\u9fa5]/g);
        if(!(nameMatch instanceof Array) || (chinese.length!=nameMatch.length)){
            return false;
        }
        return true;
    },
    setChannelId : function (id) {
        window.localStorage.c = id;
    },
    getChannelId : function () {
        if (!!window.localStorage.c && window.localStorage.c.length == 6) {
            return projectVar.channelId + window.localStorage.c;
        } else {
            return window.localStorage.c;
        }
    },
    addTimestamp : function (url) {
        if (url.indexOf('?') >= 0) {
            url += '&_st1=' + new Date().getTime();
        } else {
            url += '?_st1=' + new Date().getTime();
        }
        return url;
    },
    replaceImageUrl:function (htm){
        //var xiaolabaImg=/src='http:\/\/test11.showself.com\/uploads_admin\/home_poster\/xiaolaba.png'/g;
        //var xiaolabaImgReplace = " style=\"padding:0 2px 4px 5px;\" src='http://test11.showself.com/uploads_admin/home_poster/xiaolaba.png'";
        var oldRole=/\/role\//g;
        var newRole="/role/web/";

        var oldLevel1=/\/level1\//g;
        var newLevel1="/level1/web/";

        var oldLevel=/\/level\//g;
        var newLevel="/level/web/";

        var oldGrade=/\/grade\//g;
        var newGrade="/grade/web/";

        var oldSvip=/\/svip\//g;
        var newSvip="/svip/web/";

        // var oldProp=/\/prop\//g;
        // var newProp="/prop/web/";

        var oldStar=/\/star\/star_/g;        //star/star
        var newStar="/star/web/star_";
        if (htm!=undefined && htm!="") {
            htm = htm.replace(oldRole, newRole)
                .replace(oldLevel1, newLevel1)
                .replace(oldLevel, newLevel)
                .replace(oldGrade, newGrade)
                .replace(oldSvip, newSvip)
                // .replace(oldProp, newProp)
                .replace(oldStar, newStar);
        }
        //财富等级28级以上的用gif
        if(htm){
            var richKey = 'wealth_lv';
            var richIndex = htm.lastIndexOf(richKey);
            var richLev = 0;
            if(richIndex>0){
                try{
                    richLev = parseInt(htm.substr(richIndex+richKey.length));
                    if(richLev >= 28){
                        htm = htm.substring(0, richIndex+richKey.length+richLev.toString.length+1) + '.gif';
                    }
                }catch(e){
                    ;
                }

            }
        }
        return htm;
    },
    extend:function (destObj, srcObj) {
        jQuery.extend(destObj, srcObj);
    },
    isEmptyObject:function (obj) {
        return jQuery.isEmptyObject(obj); // true
    },
    //sign
    _cf:function(xsConfig) {
        if ((xsConfig.method == 'POST' || xsConfig.method == 'PUT' || xsConfig.method == 'DELETE' || xsConfig.method == 'GET')) {
            var enmoliSubmiter = new EnmoliSubmiter();
            var newOptions = {};
            var lastIndexOf = xsConfig.url.lastIndexOf("?");
            if (lastIndexOf > -1) {
                enmoliSubmiter.bnu(xsConfig.url.substr(lastIndexOf + 1), newOptions);
            }
            if (!!xsConfig.data) {
                enmoliSubmiter.bn(xsConfig.data, newOptions);
            } else {
                xsConfig.data = {};
            }
            var _a123 = eval("_gf" + "_constants" + 1);
            var _b2x = eval("_gf" + "_constants" + 2);
            var _c3y = eval("_gf" + "_constants" + 3);
            var aj = '_' + _a123.substring(4) + _b2x.substring(4) + _c3y.substring(4) + "1";
            //var aj = '_' + 'a' + 'ja' + 'x' + 'D' + 'a' + 'ta1';
            if (xsConfig.method == 'GET') {
                if (lastIndexOf > -1) {
                    xsConfig.url = xsConfig.url + '&' + aj + "=" +  enmoliSubmiter.bsq(newOptions);
                }
            } else {
                xsConfig.data[aj] = enmoliSubmiter.bsq(newOptions);
            }
        }
    },

     getHttpConfig:function(method, url, success, error, data, ignoreToken) {

        var xsConfig = {};
        xsConfig.method = method;
        xsConfig.url = url;
        xsConfig.success = success;
        xsConfig.error = error;
        xsConfig.data = data;
        xsConfig.headers = {};
        xsConfig.dataType = "json";
        xsConfig.headers['Content-Type'] = "application/json;charset=UTF-8";
        if (!window.localStorage.web_did) {
            window.localStorage.web_did = this.getUUID();
        }
        xsConfig.headers['web_did'] = window.localStorage.web_did;

         if(!ignoreToken) {
             if(!!window.localStorage.hrtk) {
                 if (xsConfig.url.indexOf('?') >= 0 ) {
                     xsConfig.url += '&accessToken=' + window.localStorage.hrtk;
                 } else {
                     xsConfig.url += '?accessToken=' + window.localStorage.hrtk;
                 }
             }
         }
         var channelId = XSH5Utils.getChannelId();
         if(!!channelId) {
             if (xsConfig.url.indexOf('?') >= 0 ) {
                 xsConfig.url += '&c=' + channelId;
             } else {
                 xsConfig.url += '?c=' + channelId;
             }
         }

         if(xsConfig.data != null){
             xsConfig.data["sessionid"] = window.localStorage.hrtk;
         }
         xsConfig.url = XSH5Utils.addTimestamp(xsConfig.url);
         if(!isLocal){
             this._cf(xsConfig);
         }
         if(method=="POST"||method=="post"||method=="PUT"||method=="put"){
             xsConfig.data=JSON.stringify(xsConfig.data);
         }
        return xsConfig;
    },
    getUUID:function() {
        var d = new Date().getTime();
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = (d + Math.random()*16)%16 | 0;
            d = Math.floor(d/16);
            return (c=='x' ? r : (r&0x7|0x8)).toString(16);
        });
        return uuid;
    },
    ajaxPost:function (url,data,success, error, ignoreToken) {
        var xsConfig = this.getHttpConfig("POST", url, success, error, data, ignoreToken);
        $.ajax(xsConfig);
    },
    ajaxGet:function(url, success, error, ignoreToken) {
        var xsConfig = this.getHttpConfig("GET", url, success, error, null, ignoreToken);
        $.ajax(xsConfig);
    }

};
(function(win){
    //生成随机的UID
    win.funcGetRandomUid = function(uid){
        var strNum = setRandomNum(3);
        return ''+strNum + uid;
    };
    win.funcPareseUid = function(uid){
        return (''+ uid).substr(3);
    };

    function setRandomNum(n) {
        var rnd = "";
        for ( var i = 0; i < n; i++){
            rnd += parseInt(Math.random() * 9 + 1);// 1 到9
        }
        return rnd;
    }

    //检查输入密码长度是否合法
    function checkLengthVal(t) {
        if (t.length >= 6 && t.length <= 20) {
            return true;
        } else {
            return false;
        }
    }

    //检查输入密码中包含的字符是否合法
    function checkVal(t) {
        var re = /^([a-zA-Z_0-9]{1})([\w]*)$/g;
        if (re.test(t)) {
            return true;
        } else {
            return false;
        }
    }

    function throttle(method, context) {
        var tId = null;
        return function(){
            clearTimeout(tId);
            tId = setTimeout(function(){
                method.apply(context);
            }, 100);
        }
    }

    function throttleFn(method, context) {
        var args = Array.prototype.slice.call( arguments, 2 );
        if(method.throttleFnTid){
            clearTimeout(method.throttleFnTid);
        }
        method.throttleFnTid = setTimeout(function(){
            method.apply(context,args);
        }, 100);
    }
    /* 订阅发布模式 */
    var EventMd = (function(){
        var global = this,
            EventMd,
            _default = 'default';
        EventMd = function(){
            var _listen,
                _trigger,
                _remove,
                _slice = Array.prototype.slice,
                _shift = Array.prototype.shift,
                _unshift = Array.prototype.unshift,
                namespaceCache = {},
                _create,
                find,
                each = function( ary, fn ){
                    var ret;
                    for ( var i = 0, l = ary.length; i < l; i++ ){
                        var n = ary[i];
                        ret = fn.call( n, i, n);
                    }
                    return ret;
                };
            _listen = function( key, fn, cache ){
                if ( !cache[ key ] ){
                    cache[ key ] = [];
                }
                cache[key].push( fn );
            };
            _remove = function( key, cache ,fn){
                if ( cache[ key ] ){
                    if( fn ){
                        for( var i = cache[ key ].length; i >= 0; i-- ){
                            if( cache[ key ] === fn ){
                                cache[ key ].splice( i, 1 );
                            }
                        }
                    }else{
                        cache[ key ] = [];
                    }
                }
            };
            _trigger = function(){
                var cache = _shift.call(arguments),
                    key = _shift.call(arguments),
                    args = arguments,
                    _self = this,
                    ret,
                    stack = cache[ key ];
                if ( !stack || !stack.length ){
                    return;
                }
                return each( stack, function(){
                    return this.apply( _self, args );
                });
            };
            _create = function( namespace ){
                var namespace = namespace || _default;
                var cache = {},
                    offlineStack = [], // 离线事件
                    ret = {
                        listen: function( key, fn, last ){
                            _listen( key, fn, cache );
                            if ( offlineStack === null ){
                                return;
                            }
                            if ( last === 'last' ){
                            }else{
                                each( offlineStack, function(){
                                    this();
                                });
                            }
                            offlineStack = null;
                        },
                        one: function( key, fn, last ){
                            _remove( key, cache );
                            this.listen( key, fn ,last );
                        },
                        remove: function( key, fn ){
                            _remove( key, cache ,fn);
                        },
                        trigger: function(){
                            var fn,
                                args,
                                _self = this;
                            _unshift.call( arguments, cache );
                            args = arguments;
                            fn = function(){
                                return _trigger.apply( _self, args );
                            };
                            if ( offlineStack ){
                                return offlineStack.push( fn );
                            }
                            return fn();
                        }
                    };
                return namespace ?
                    ( namespaceCache[ namespace ] ? namespaceCache[ namespace ] :
                        namespaceCache[ namespace ] = ret )
                    : ret;
            };
            return {
                create: _create,
                one: function( key,fn, last ){
                    var event = this.create( );
                    event.one( key,fn,last );
                },
                remove: function( key,fn ){
                    var event = this.create( );
                    event.remove( key,fn );
                },
                listen: function( key, fn, last ){
                    var event = this.create( );
                    event.listen( key, fn, last );
                },
                trigger: function(){
                    var event = this.create( );
                    event.trigger.apply( this, arguments );
                }
            };
        }();
        return EventMd;
    })();

    var eventEmType = {
        EM_TYPE_ROOM_INIT:"roomInti",
        EM_TYPE_ENTER_ROOM:"enterRoom",
        EM_TYPE_ROOM_WAND_LIST:"roomWandList",
        EM_TYPE_USER_INFO_CHANGE:"userInfoChange",
        EM_TYPE_ROOM_INFO_CHANGE:"roomInfoChange",
        EM_TYPE_FLASH_EVT:"flashEvent",

        EM_SPACE_MESSAGE:"message",


        //子类型
        EM_SUB_TYPE_MONEY_CHANGE:'moneyChange',
        EM_SUB_TYPE_ANCHOR_LEVEL_CHANGE:'anchorLevelChange',
        EM_SUB_TYPE_LOCAL_STORAGE_MONEY:'localStorageMoney',
        EM_SUB_TYPE_LOCAL_STORAGE_DIAMOND:'localStorageDiamond',
        EM_SUB_TYPE_LOCAL_STORAGE_AVATAR:'localStorageAvatar',

        //flash event
        EM_SUB_TYPE_FLASH_VIDEO_FLOW_INTERRUPT:'flashVideoFlowInterrupt'




    };

    /*
     * MAP对象，实现MAP功能
     *
     * 接口：
     * size()     获取MAP元素个数
     * isEmpty()    判断MAP是否为空
     * clear()     删除MAP所有元素
     * put(key, value)   向MAP中增加元素（key, value)
     * remove(key)    删除指定KEY的元素，成功返回True，失败返回False
     * get(key)    获取指定KEY的元素值VALUE，失败返回NULL
     * element(index)   获取指定索引的元素（使用element.key，element.value获取KEY和VALUE），失败返回NULL
     * containsKey(key)  判断MAP中是否含有指定KEY的元素
     * containsValue(value) 判断MAP中是否含有指定VALUE的元素
     * values()    获取MAP中所有VALUE的数组（ARRAY）
     * keys()     获取MAP中所有KEY的数组（ARRAY）
     *
     * 例子：
     * var map = new Map();
     *
     * map.put("key", "value");
     * var val = map.get("key")
     * ……
     *
     */
    var Map = function() {
        this.elements = new Array();
    };
    Map.prototype={
        //获取MAP元素个数
        size:function() {
            return this.elements.length;
        },

        //判断MAP是否为空
        isEmpty:function() {
            return(this.elements.length < 1);
        },

        //删除MAP所有元素
        clear:function() {
            //this.elements = new Array();
            this.elements.length = 0;
        },

        //向MAP中增加元素（key, value)
        put: function(_key, _value) {
            this.elements.push( {
                key : _key,
                value : _value
            });
        },

        //删除指定KEY的元素，成功返回True，失败返回False
        remove:function(_key) {
            var bln = false;
            try{
                for(var i = 0; i < this.elements.length; i++) {
                    if(this.elements[i].key == _key) {
                        this.elements.splice(i, 1);
                        return true;
                    }
                }
            } catch(e) {
                bln = false;
            }
            return bln;
        },

        //获取指定KEY的元素值VALUE，失败返回NULL
        get:function(_key) {
            try{
                //console.log(this.elements.length);
                for(var i = 0; i < this.elements.length; i++) {
                    if(this.elements[i].key == _key) {
                        return this.elements[i].value;
                    }
                }
            } catch(e) {
                return null;
            }
        },

        //获取指定索引的元素（使用element.key，element.value获取KEY和VALUE），失败返回NULL
        element:function(_index) {
            if(_index < 0 || _index >= this.elements.length) {
                return null;
            }
            return this.elements[_index];
        },

        //判断MAP中是否含有指定KEY的元素
        containsKey:function(_key) {
            var bln = false;
            try{
                for(var i = 0; i < this.elements.length; i++) {
                    if(this.elements[i].key == _key) {
                        bln = true;
                    }
                }
            } catch(e) {
                bln = false;
            }
            return bln;
        },

        //判断MAP中是否含有指定VALUE的元素
        containsValue:function(_value) {
            var bln = false;
            try{
                for(var i = 0; i < this.elements.length; i++) {
                    if(this.elements[i].value == _value) {
                        bln = true;
                    }
                }
            } catch(e) {
                bln = false;
            }
            return bln;
        },

        //获取MAP中所有VALUE的数组（ARRAY）
        values:function() {
            var arr = new Array();
            for(var i = 0; i < this.elements.length; i++) {
                arr.push(this.elements[i].value);
            }
            return arr;
        },

        //获取MAP中所有KEY的数组（ARRAY）
        keys:function() {
            var arr = new Array();
            for(var i = 0; i < this.elements.length; i++) {
                arr.push(this.elements[i].key);
            }
            return arr;
        }
    };


    win.EventMd = EventMd;
    win.eventEmType = eventEmType;
    win.throttle = throttle;
    win.throttleFn = throttleFn;
    win.setRandomNum = setRandomNum;
    win.checkLengthVal = checkLengthVal;
    win.checkVal = checkVal;
    win.Map = Map;

})(window);
var PROJECT_HONG_REN = 0x01;
var PROJECT_MI_FENG = 0x02;