(function(win){
    'use strict';

    (function() {
        var hm = document.createElement("script");hm.src = "//static.geetest.com/static/tools/gt.js";var s = document.getElementsByTagName("script")[0];s.parentNode.insertBefore(hm, s);
    })();

    function WebGeetest(appendTo, http, onSuccess){
        var _self = this;
        _self.appendTo = appendTo;
        _self.http = http;
        _self.onSuccess = onSuccess;
        _self.id = WebGeetest.uid++;
        _self.captchaObj = null;

        _self.funcInit();
    }
    WebGeetest.uid = 1;
    WebGeetest.prototype = {
        funcInit:function(){
            $(this.appendTo).html(this.mb.replace(/\{\{id\}\}/g, this.id));
            this.funcGetCode();
        },
        getValidate:function(){
            return this.captchaObj.getValidate();
        },
        funcRefresh:function(){
            if(this.captchaObj){
                this.captchaObj.refresh();
            }
        },
        handlerEmbed:function(captchaObj){
            var that = this;
            this.captchaObj = captchaObj;
            // 将验证码加到id为captcha的元素里，同时会有三个input的值：geetest_challenge, geetest_validate, geetest_seccode
            captchaObj.appendTo("#embed-captcha"+this.id);
            if(typeof this.onSuccess === 'function'){
                captchaObj.onSuccess(this.onSuccess);
            }
            captchaObj.onReady(function () {
                $("#wait"+that.id)[0].className = "hide";
            });
            // 更多接口参考：http://www.geetest.com/install/sections/idx-client-sdk.html
        },
        funcGetCode:function(){
            var that = this;
            var url = xsServiceURL+"/geetest/code?t=" + (new Date()).getTime(); // 加随机数防止缓存
            this.http(url,function (msg) {
                    // 使用initGeetest接口
                    // 参数1：配置参数
                    // 参数2：回调，回调的第一个参数验证码对象，之后可以使用它做appendTo之类的事件
                    if(msg && msg.data && msg.data.result){
                        var gtData = (msg.data.result);
                        initGeetest({
                            gt: gtData.gt,
                            challenge: gtData.challenge,
                            product: "float", // 产品形式，包括：float，embed，popup。注意只对PC版验证码有效
                            offline: !gtData.success // 表示用户后台检测极验服务器是否宕机，一般不需要关注
                            // 更多配置参数请参见：http://www.geetest.com/install/sections/idx-client-sdk.html#config
                        }, that.handlerEmbed.bind(that));
                    }
                });
        },
        mb:'\
        <div id="embed-captcha{{id}}"></div>\
        <p id="wait{{id}}" class="show">正在加载验证码......</p>\
        <p id="notice{{id}}" class="hide">请先拖动验证码到相应位置</p>'

    };

    win.WebGeetest = WebGeetest;
})(window);