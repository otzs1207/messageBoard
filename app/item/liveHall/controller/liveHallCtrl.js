
(function(module){

    function liveHallCtrl($scope, $timeout, $state,$interval, liveHallSrv){
        //活动 公告 新闻列表的json对象
        var that = this;
        console.log("加载成功...");
        this.loginShow = false;
        this.funcGetLoginUp = function(){
            that.loginShow = true;
        }

        this.funcGetLoginUpClose = function(){
            that.loginShow = false;
            console.log(that.loginShow);
        }
    }

    module.controller('xsWeb.liveHall.mainCtrl',['$scope', '$timeout', '$state','$interval','xsWeb.liveHall.mainSrv' ,liveHallCtrl])
})(liveHallModule);
