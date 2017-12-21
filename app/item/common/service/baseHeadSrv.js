/**
 * Created by NM-029 on 1/17/2017.
 */
//
(function(module) {
    'use strict';

    var baseHeadFactory = function (httpSrv, paraCheckSrv, notificationSrv, userSrv) {

        var baseHeadSrv = function () {
            this.userAnchorStaus = 0; //用户开播状态:0 不可开播  1可以开播
            this.funcInit();
        };
        baseHeadSrv.prototype={
            constructor:baseHeadSrv,
            funcInit:function () {
            },
            //修改昵称
            funcModifyUserNickName:function(userNewName){
                //http://server:port/v2/userw/updatenickname?accessToken={accessToken}
                var that = this;
                var data = {
                    "nickname" : userNewName
                };
                var url = xsServiceURL+'/userw/updatenickname';
                httpSrv.post(url,data,function(response){
                    if(paraCheckSrv.checkResponseAndAlertError(response)){
                        notificationSrv.funcTankuang('昵称修改成功');
                        userSrv.funcGetUser().funcSetNickName(userNewName);
                        userSrv.setUser();
                    }
                });
            },
            funcGetUserInfo:function(){
                var that = this;
                //http://server:port/v2/userw/baseinfo?uid={uid}&accessToken={accessToken}
                var url = xsServiceURL+'/userw/baseinfo';
                httpSrv.get(url,function (response) {
                    if(paraCheckSrv.checkResponseAndAlertError(response)){
                        var data = response.data;
                        var user = userSrv.funcGetUser();
                        user.funcSetNickName(data.nickname);
                        user.funcSetAvatar(data.avatar);
                        user.funcSetDiamond(data.diamond);
                        user.funcSetMoney(data.money);
                        userSrv.setUser();
                    }
                });
            },
            //获取他人信息
            funcGetSpaceInfo:function(uid,suc){
                var that = this;
                var url = xsServiceURL+'/userw/userspace?uid=' + uid;
                httpSrv.get(url,function (response) {
                    if(paraCheckSrv.checkResponseAndAlertError(response)){
                        var data = response.data;
                        if(typeof suc === 'function'){
                            suc(data);
                        }
                        // var anchorLevelInfo = new AnchorLevelInfo(XSH5Utils.replaceImageUrl(data.anchorInfo.image),XSH5Utils.replaceImageUrl(data.anchorInfo.next_image),data.anchorInfo.short_score);
                        // XSH5Utils.extend(that.anchorLevelInfo, anchorLevelInfo);
                        // var expInfo = new UserExpInfo(XSH5Utils.replaceImageUrl(data.expInfo.image),XSH5Utils.replaceImageUrl(data.expInfo.next_image),data.expInfo.short_score);
                        // XSH5Utils.extend(that.expInfo, expInfo);
                        // var userInfo = new UserInfo(data.uid,data.nickname,data.avatar,data.isAnchor,data.anchor_status,data.focusNum,data.roomid,data.showid,data.note,data.isRelation);
                        // XSH5Utils.extend(that.userInfo, userInfo);
                    }
                });
            },
            funcCheckAnchorStatus : function(suc){
                var that = this;
                var url = xsServiceURL+'/roomw/anchor/status?accessToken='+userSrv.funcGetUser().funcGetSession();
                httpSrv.get(url,function (response) {
                    //if(paraCheckSrv.checkResponseAndAlertError(response)){
                    if(response.status.statuscode == 0){
                        that.userAnchorStaus = 1;
                    }
                    if(typeof suc == 'function'){
                        suc();
                    }
                });
            },
            funcGetUserAnchorStatus:function(){
                return this.userAnchorStaus;
            },
            //进入个人主页
            funcToPersonSpace:function(uid){
                if(!uid){
                    return ;
                }
                var strNum = setRandomNum(3);
                var type = "";
                if (userSrv.funcGetUser().funcGetUid() == uid) {
                    type = 1;
                }else{
                    type = 2;
                }
                var toid = strNum + uid;
                window.open("#/profile/" + toid+"_"+type,"_blank");
            }
        };
        return new baseHeadSrv();
    };
    module.factory('xsWeb.common.baseHeadSrv', ['xsWeb.common.httpSrv', 'xsWeb.common.paraCheckSrv', 'xsWeb.common.notificationSrv', 'xsWeb.common.userSrv', baseHeadFactory]);
})(commonModule);
