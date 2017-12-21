/**  * Created by hf-mini on 15/11/19.  */

(function(){

    function indexCtrl($state, $location, notificationSrv){
        // this.tankuang = notificationSrv.funcGetTankuang();      //弹框提示
        // this.hongrenAlert = notificationSrv.funcGetHongrenAlert();      //系统自定义弹框提示
        // this.hongrenAlertSubmit = notificationSrv.funcGetHongrenAlertSubmit();      //系统自定义弹框提示，带确定按钮

        /**
         *  点击余额不足弹框中充值按钮跳转到充值页面
         */
        this.funcRecharge = function(){
            var url = $state.href('baseHead.recharge');
            window.open(url,'_blank');
        };

        //存储channelId
        function setChannelId() {
            var hasChannelId = false;
            var channelId = $location.search()['c'];
            if (channelId != true && !!channelId) {
                XSH5Utils.setChannelId(channelId);
                hasChannelId = true;
            } else {
                channelId = $location.search()['C'];
                if (channelId != true && !!channelId) {
                    XSH5Utils.setChannelId(channelId);
                    hasChannelId = true;
                }
            }
            if (!hasChannelId) {
                var s = window.location.search;
                if (!!s) {
                    var stext = s.substring(1,s.Length);
                    var params = stext.split("&");
                    for (var index in params) {
                        var param =  params[index].split("=");
                        if (param[0].toLowerCase() == "c") {
                            XSH5Utils.setChannelId(param[1]);
                            break;
                        }
                    }
                }
            }
        }
        setChannelId();
    }

angular.module('xsWeb').controller('xsWeb.indexCtrl', ['$state', '$location', 'xsWeb.common.notificationSrv',indexCtrl]);
})();