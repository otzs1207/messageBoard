/**
 * Created by NM-029 on 9/6/2016.
 */
(function(module, win) {
    'use strict';

    function liveHallMainFactory(  $http, notificationSrv) {

        var that = this;
        var RankCategory = function(uid){
            this.uid = uid;
        };

        RankCategory.prototype = { //向前台html页面提供获取数据的接口
            constructor:RankCategory
        };

        var LiveHallMainSrv = function () {
            this.funcInit();
        };

        LiveHallMainSrv.prototype={
            constructor:LiveHallMainSrv,
            funcInit:function () {

            }

        };

        var liveHallMainSrv = new LiveHallMainSrv();

        return liveHallMainSrv;

    }

    module.factory('xsWeb.liveHall.mainSrv', [ '$http',
        'xsWeb.common.notificationSrv',liveHallMainFactory]);
})(roomModule, window);
