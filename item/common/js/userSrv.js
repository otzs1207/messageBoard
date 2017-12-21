commonModule.factory('xsWeb.common.userSrv', ['$window', 'xsWeb.common.httpSrv',
    function ($window, httpSrv) {
        var that = this;
        //loginType属性说明 0代表游客 1代表用户名密码登陆
        var UserInfo = function () {

            // of 测试
            // this.user = new G_OBJ_user(true, "", "", "", 0, 0,
            //     "", "", "",  "", '1',  false, '',
            //     false, "123456", 0, '', '');
            this.user = null;
            this.funcInit();
        };
        UserInfo.prototype={
            constructor:UserInfo,
            funcInit:function () {
              //将localStorage转存为G_OBJ_user
                var tempUser = getUser();
                var token = getToken();
                var uid = getUserId();
                var username = getUserName();
                var showid = tempUser.hrsod;
                var avatar = tempUser.hraat;
                var money = tempUser.hrmny;
                var diamond = tempUser.hrdia;
                var logTim = tempUser.logTim;
                var mobile = tempUser.hrmb;
                var password = '';
                if(token && token!='undefined' && uid && uid!='undefined'){
                    //function(isVisitor, avatar, nickname, showid, diamond, money, richLevelUrl, startLevelUrl, flowerLevelUrl,
                    //sendFlowerId, uid, isAnchor, roomId, isInMyRoom, password, followers, armyId, armyRole, sessionid){
                    this.user = new G_OBJ_user(false, avatar, username, showid, diamond, money,
                        "", "", "",  "", uid,  false, '',
                        false, password, 0, '', '', token, logTim, mobile);
                }
                //监听币变化
                $window.EventMd.create(eventEmType.EM_TYPE_USER_INFO_CHANGE).listen(eventEmType.EM_SUB_TYPE_LOCAL_STORAGE_MONEY, function (money) {
                    throttleFn(setUserMoney, that, money);
                });
                $window.EventMd.create(eventEmType.EM_TYPE_USER_INFO_CHANGE).listen(eventEmType.EM_SUB_TYPE_LOCAL_STORAGE_DIAMOND, function (diamond) {
                    throttleFn(setUserDiamond, that, diamond);
                });
                $window.EventMd.create(eventEmType.EM_TYPE_USER_INFO_CHANGE).listen(eventEmType.EM_SUB_TYPE_LOCAL_STORAGE_AVATAR, function (avatar) {
                    throttleFn(setAvatar, that, avatar);
                });

            },
            funcGetUser:function () {
                return this.user;
            },
            funcSetUser:function (user) {
                this.user = user;
            }
        };
        var userInfo = new UserInfo();


        function getUser() {
            return window.localStorage;
        }

        function setUser() {
            /*
            userSrv.setUserId(userInfo.uid);
            userSrv.setPassword(passwd);
            userSrv.setToken(userInfosessionid);
            userSrv.setUserName(userInfonickname);
            userSrv.setAvatar(userInfo.avatar);
            */
            var userInfo = this.funcGetUser();
            getUser().hrud = userInfo.funcGetUid();
            getUser().hrnm = userInfo.funcGetNickName();
            getUser().hrsod = userInfo.funcGetShowId();
            getUser().hraat = userInfo.funcGetAvatar();
            getUser().hrmny = userInfo.funcGetMoney();
            getUser().hrdia = userInfo.funcGetDiamond();
            getUser().hrtk = userInfo.funcGetSession();
            getUser().hrmb = userInfo.funcGetLoginMobile();
            //记录登录时间
            getUser().logTim = userInfo.funcGetLoginTime();
        }
        function clearUser() {
            getUser().removeItem("hrtk");
            getUser().removeItem("hrud");
            getUser().removeItem("hrmb");
        }

        function getUserId() {
            return getUser().hrud;
        }

        function getUserName() {
            return getUser().hrnm;
        }

        function getToken() {
            return getUser().hrtk;
        }
        function getLoginTime() {
            return getUser().logTim;
        }
        function getLoginMobile(){
            return getUser().hrmb;
        }

        function getAvatar() {
            return getUser().hraat;
        }

        function getLoginType() {
            return getUser().loginType;
        }

        function setUserName(userName) {
            getUser().hrnm = userName;
        }

        function setUserId(userId) {
            getUser().hrud = userId;
        }

        function setLoginType(loginType) {
            getUser().loginType = loginType;
        }


        function setToken(token) {
            getUser().hrtk = token;
        }

        function setAvatar(avatar) {
            getUser().hraat = avatar;
        }
        function setUserMoney(money) {
            getUser().hrmny = +money;
        }
        function setUserDiamond(diamond) {
            getUser().hrdia = +diamond;
        }
        function removeToken() {
            getUser().removeItem("hrtk");
        }

        /**
         * 获取游客sessionid
         */
        function requestVisitorSession(suc, err) {
            var url = xsServiceURL + "/custuser/visitor";
            httpSrv.get(url, suc, err);
        }


        return {
            /*
            getUser: getUser,

            getUserId: getUserId,
            getToken: getToken,
            getLoginType: getLoginType,
            getUserName: getUserName,
            getAvatar: getAvatar,
            getPassword: getPassword,
            setPassword: setPassword,
            setUserName: setUserName,
            setUserId: setUserId,
            setToken: setToken,
            setAvatar: setAvatar,
            setLoginType: setLoginType,
            requestVisitorSession: requestVisitorSession,
            removeToken : removeToken,
            removePassword : removePassword,
            getIdCheckData:getIdCheckData,
            setIdCheckData:setIdCheckData,
            */
            setUser: setUser.bind(userInfo),
            clearUser:clearUser,
            //------------
            setUserMoney:setUserMoney,
            setUserAvatar:setAvatar,
            setUserDiamond:setUserDiamond,
            funcGetUser:userInfo.funcGetUser.bind(userInfo),
            funcSetUser:userInfo.funcSetUser.bind(userInfo)
        }
    }]);