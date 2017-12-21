/**
 * Created by NM-029 on 8/16/2016.
 */
(function(win, $){
    /*用户类*/
    var G_OBJ_user = function(isVisitor, avatar, nickname, showid, diamond, money, richLevelUrl, startLevelUrl, flowerLevelUrl,
                              sendFlowerId, uid, isAnchor, roomId, isInMyRoom, password, followers, armyId, armyRole, sessionid, loginTime, mobile){
        this.isVisitor = isVisitor;
        this.avatar = avatar;
        this.nickname = nickname;
        this.showid = showid;
        this.diamond = diamond;                  //红钻
        this.money = money;                      //红票
        this.richLevelUrl = richLevelUrl;        //财富等级URL
        this.richLevel = richLevelUrl?parseInt(richLevelUrl.substr(richLevelUrl.indexOf("wealth_lv")+'wealth_lv'.length)):0;  //财富等级URL
        this.sessionid = sessionid;

        this.starLevelUrl = startLevelUrl;       //明星等级
        this.starNextLevelUrl = startLevelUrl;   //明星等级的下一级
        this.flowerLevelUrl = flowerLevelUrl;    //鲜花等级
        this.sendFlowerId = sendFlowerId;        //鲜花ID(送免费花时用到)
        this.uid = uid;
        this.isAnchor = isAnchor;
        this.roomId = roomId;
        this.isInMyRoom = isInMyRoom;            //主播进入自己的房间时才为true;
        this.password = password;
        this.followers = followers;              //关注人数

        this.armyId = armyId;                    //所在军团ID
        this.armyRole = armyRole;                //用户在军团的角色， 角色0军团普通成员、1管理员、2司令,

        this.loginTime = loginTime;              //登录时间
        this.mobile = mobile;                    //登录手机号

    };

    G_OBJ_user.prototype = {
        constructor:G_OBJ_user,
        funcGetIsVisitor:function(){
            return this.isVisitor;
        },
        funcGetUid:function(){
            return this.uid;
        },
        funcGetFormNickName:function(){
            return this.nickname.length>8?this.nickname.substr(0, 8):this.nickname;
        },
        funcGetNickName:function(){
            return this.nickname;
        },
        funcGetAvatar:function(){
            return this.avatar;
        },
        funcGetShowId:function(){
            return this.showid;
        },
        funcGetRichLevel:function(){
            return this.richLevel;
        },
        funcGetRichLevelUrl:function(){
            return this.richLevelUrl;
        },
        funcGetStarLevelUrl:function(){
            return this.starLevelUrl;
        },
        funcGetStarNextLevelUrl:function(){
            return this.starNextLevelUrl;
        },
        funcGetMoney:function(){
            return this.money;
        },
        funcGetDiamond:function(){
            return this.diamond;
        },
        funcGetIsAnchor:function(){
            return this.isAnchor;
        },
        funcGetRoomId:function(){
            return this.roomId;
        },
        funcGetIsInMyRoom:function(){
            return this.isInMyRoom;
        },
        funcGetSendFlowerId:function(){
            return this.sendFlowerId;
        },
        funcGo2HomePage:function(){
            return funcGo2TaHome(this.uid);
        },
        funcGetPassWord:function(){
            return this.password;
        },
        funcGetSession:function(){
            return this.sessionid;
        },
        funcGetFollowers:function(){
            return this.followers;
        },
        funcGetArmyId:function(){
            return this.armyId;
        },
        funcGetArmyRole:function(){
            return this.armyRole;
        },
        funcGetLoginTime:function(){
            return this.loginTime;
        },
        funcGetLoginMobile:function(){
            return this.mobile;
        },
        funcSetUid:function(uid){
            this.uid = uid;
        },
        funcSetSendFlowerId:function(sendFlowerId){
            this.sendFlowerId = sendFlowerId;
        },
        funcSetPassWord:function(password){
            this.password = password;
        },
        funcSetIsInMyRoom:function(isInMyRoom){
            this.isInMyRoom = isInMyRoom;
        },
        funcSetNickName:function(nickname){
            this.nickname = nickname;
        },
        funcSetMoney:function(money){
            if(!isNaN(money) && (this.money != money)){
                this.money = +money;
                //触发更新local staorage
                win.EventMd.create(eventEmType.EM_TYPE_USER_INFO_CHANGE).trigger(eventEmType.EM_SUB_TYPE_LOCAL_STORAGE_MONEY, this.money);
            }
        },
        funcSetDiamond:function(diamond){
            if(!isNaN(diamond) && (this.diamond != diamond)){
                this.diamond = +diamond;
                //触发更新local staorage
                win.EventMd.create(eventEmType.EM_TYPE_USER_INFO_CHANGE).trigger(eventEmType.EM_SUB_TYPE_LOCAL_STORAGE_DIAMOND, this.diamond);
            }
        },
        funcSetAvatar:function(avatar){
            if(avatar && (this.avatar != avatar)){
                this.avatar = avatar;
                //触发更新local staorage
                win.EventMd.create(eventEmType.EM_TYPE_USER_INFO_CHANGE).trigger(eventEmType.EM_SUB_TYPE_LOCAL_STORAGE_AVATAR, this.avatar);
            }
        },
        funcSetRichLevelUrl:function(richLevelUrl){
            this.richLevelUrl = richLevelUrl;
            // this.richLevel = richLevelUrl?parseInt(richLevelUrl.substr(richLevelUrl.indexOf("wealth_lv")+'wealth_lv'.length)):0;   //财富等级URL
        },
        funcSetRichLevel:function(richLevel){
            this.richLevel = richLevel;
        },
        funcSetFollowers:function(followers){
            this.followers = followers;
        },
        funcSetStarLevelUrl:function(starLevelUrl){
            this.starLevelUrl =starLevelUrl;
        },
        funcSetStarNextLevelUrl:function(starNextLevelUrl){
            this.starNextLevelUrl = starNextLevelUrl;
        }
    };

    /*主播类*/
    var G_OBJ_anchor = function(isVisitor, avatar, nickname, showid, diamond, money, richLevelUrl, startLevelUrl, flowerLevelUrl, sendFlowerId, uid, isAnchor, isInMyRoom,password,followers, armyId, armyRole,sessionid,
                                roomid, onLineTime, isOnline, mode){
        G_OBJ_user.call(this,isVisitor, avatar, nickname, showid, diamond, money, richLevelUrl, startLevelUrl, flowerLevelUrl, sendFlowerId, uid, isAnchor, roomid, isInMyRoom,password, followers, armyId, armyRole,sessionid);

        this.roomid = roomid;
        this.onLineTime = onLineTime;       //开播时间
        this.isOnline = isOnline;           //主播是否在线
        this.mode = mode;                   //在哪里开播的
    };


    G_OBJ_anchor.prototype = new G_OBJ_user();
    G_OBJ_anchor.prototype.constructor = G_OBJ_anchor;
    G_OBJ_anchor.prototype.EM_MODE_MOBILE = 0;      //在手机开播
    G_OBJ_anchor.prototype.EM_MODE_PC = 1;          //在PC开播
    G_OBJ_anchor.prototype.funcGetOnLineTime=function(){
        return this.onLineTime;
    };
    G_OBJ_anchor.prototype.funcGetHostvalue=function(){
        return this.hostvalue;
    };
    G_OBJ_anchor.prototype.funcGetScore=function(){
        return this.score;
    };
    G_OBJ_anchor.prototype.funcGetScoreUp=function(){
        return this.scoreUp;
    };
    G_OBJ_anchor.prototype.funcGetIsOnline=function(){
        return this.isOnline;
    };
    G_OBJ_anchor.prototype.funcGetMode=function(){
        return this.mode;
    };
    G_OBJ_anchor.prototype.funcSetMode=function(mode){
        this.mode = mode;
    };
    G_OBJ_anchor.prototype.funcSetOnLineTime=function(onLineTime){
        this.onLineTime = onLineTime;
    };

    G_OBJ_anchor.prototype.funcSetIsOnline=function(isOnline){
        this.isOnline = isOnline;
    };

    function  setUser2localStorage(userInfo) {
        var localStorage  = window.localStorage;
        localStorage.hrud = userInfo.funcGetUid();
        localStorage.hrnm = userInfo.funcGetNickName();
        localStorage.hrsod = userInfo.funcGetShowId();
        localStorage.hraat = userInfo.funcGetAvatar();
        localStorage.hrmny = userInfo.funcGetMoney();
        localStorage.hrdia = userInfo.funcGetDiamond();
        localStorage.hrtk = userInfo.funcGetSession();
        localStorage.hrmb = userInfo.funcGetLoginMobile();
        localStorage.logTim = userInfo.funcGetLoginTime();
    }

    win.G_OBJ_user = G_OBJ_user || Object;
    win.G_OBJ_anchor = G_OBJ_anchor || Object;
    win.setUser2localStorage = setUser2localStorage;
})(window,jQuery);
