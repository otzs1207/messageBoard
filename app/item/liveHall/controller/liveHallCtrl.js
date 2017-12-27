
(function(module){

    function liveHallCtrl($scope, $timeout, $state,$interval,notificationSrv, liveHallSrv){
        //活动 公告 新闻列表的json对象
        var that = this;
        console.log("加载成功...");
        this.loginShow = false;
        this.funcGetLoginUp = function(){                   //显示登录框
            that.loginShow = true;
        }

        this.funcGetLoginUpClose = function(){              //隐藏登录框
            that.loginShow = false;
        }
        var LoginView = function () {
            var that = this;

            //验证码登录/密码登录选项切换
            this.loginMethodTabs = ['验证码登录','密码登录'];
            this.loginMethod = 0;
            this.funcChangePicType = function($index){  //当前选中的是 验证码登录/密码登录 选项卡
                this.loginMethod = $index;
                this.loginBtn1 = true;
                this.loginBtn2 = false;
                if($index == 0){
                    this.loginMobile = "";
                    this.loginPassword = "";
                }
                else{
                    this.loginMobile = "";
                    $interval.cancel(this.timer);
                    this.timer = undefined;
                    this.loginSecond = 59;
                    this.securityCodeTip = "重新获取验证码";
                    this.loginCode = "";
                }
            };

            //登录输入数据
            this.loginMobile = "";
            this.loginPassword = "";
            this.loginCode = "";
            this.securityCodeTip = "免费获取验证码";
            this.loginSecond = 59;

            //获取验证码按钮背景控制
            this.securityCodeBtn1 = true;
            this.securityCodeBtn2 = false;
            this.geetestSuccessFg = false;

            //登录按钮背景控制
            this.loginBtn1 = true;
            this.loginBtn2 = false;
            // this.funcInit();
        };
        LoginView.prototype = {
            funcInit:function () {

            },
            funcRegBoxShow:function(){

            },
            funcSecurityCodeBtn:function(){  //获取验证码按钮样式控制
                if(this.loginMobile.length == 11){
                    this.securityCodeBtn1 = false;
                    this.securityCodeBtn2 = true;
                }
                else{
                    this.securityCodeBtn1 = true;
                    this.securityCodeBtn2 = false;
                }
            },
            funcLoginBtn:function(){  //登录按钮样式控制
                if(this.loginMobile.length == 11 && this.loginCode.length == 6 && this.geetestSuccessFg == true ||
                    this.loginMobile.length == 11 && this.loginPassword.length >= 6 && this.loginPassword.length <= 20 && this.geetestSuccessFg == true){
                    this.loginBtn1 = false;
                    this.loginBtn2 = true;
                }
                else{
                    this.loginBtn1 = true;
                    this.loginBtn2 = false;
                }
            },
            funcGetPhoneCode:function () {  //获取验证码
                var that = this;
                if(!this.loginMobile){
                    // return notificationSrv.funcTankuang('请输入手机号');
                }
                else if(!XSH5Utils.funcPhoneNumCheck(this.loginMobile)){
                    // return notificationSrv.funcTankuang('手机号输入有误');
                }
                // if(that.loginSecond == 59){
                //     loginRegSrv.funcSrvGetPhoneCode(this.loginMobile);
                //     that.timer = $interval(function(){
                //         if(that.loginSecond<=0){
                //             $interval.cancel(that.timer);
                //             that.timer = undefined;
                //             that.loginSecond = 59;
                //             that.securityCodeTip = "重新获取验证码";
                //         }else{
                //             that.securityCodeTip = that.loginSecond + "秒后可重新获取";
                //             that.loginSecond--;
                //         }
                //     },1000);
                // }
            },
            funcCodeLoginAction: function () {  //手机号+验证码登录
                if(!this.loginMobile){
                    // return notificationSrv.funcTankuang('请输入手机号');
                }
                else if(!XSH5Utils.funcPhoneNumCheck(this.loginMobile)){
                    // return notificationSrv.funcTankuang('手机号输入有误');
                }
                else if(!this.loginCode && this.securityCodeTip == "免费获取验证码"){
                    // return notificationSrv.funcTankuang('请获取验证码');
                }
                // else if(this.securityCodeTip != "免费获取验证码"){
                //     if(!this.loginCode){
                //         return notificationSrv.funcTankuang('请输入验证码');
                //     }
                //     if(this.geetestSuccessFg == false){
                //         return notificationSrv.funcTankuang('验证未通过');
                //     }
                //     var validate = loginGeetest.getValidate();
                //     if(!validate){
                //         return notificationSrv.funcTankuang('验证码验证失败');
                //     }else{
                //         var regData = {
                //             "phoneNum": this.loginMobile,
                //             "checkCode": this.loginCode,
                //             "geetest_challenge":validate.geetest_challenge,
                //             "geetest_validate":validate.geetest_validate,
                //             "geetest_seccode":validate.geetest_seccode
                //         };
                //         loginRegSrv.funcUserLogin(regData, this.funcHideLoginPane);
                //     }
                // }
                // else{
                //     if(this.securityCodeTip == "免费获取验证码"){
                //         return notificationSrv.funcTankuang('请获取验证码');
                //     }
                // }
            },
            funcRegLoginAction:function(){  //手机号+密码登录
                console.log("手机号登录");
                var reg = new RegExp(/^(\w){6,20}$/);
                if(!this.loginMobile){
                    console.log("请输入手机号");
                    return notificationSrv.funcTankuang('请输入手机号');
                }
                else if(!XSH5Utils.funcPhoneNumCheck(this.loginMobile)){
                    console.log("手机号输入有误");
                    return notificationSrv.funcTankuang('手机号输入有误');
                }
                else if(!this.loginPassword){
                    console.log("手机号输入有误");
                    return notificationSrv.funcTankuang('请输入密码');
                }
                else if(!reg.test(this.loginPassword)){
                    console.log("密码格式有误");
                    return notificationSrv.funcTankuang('密码格式有误，请输入6-20位字母、数字、下划线');
                }else{
                    event.preventDefault();
                    $('.form_signUp').fadeOut(500);
                    $('.wrapper_signUp').addClass('form-success');
                }

                // else if(this.geetestSuccessFg == false){
                //     return notificationSrv.funcTankuang('验证未通过');
                // }
                // var userLogName = this.loginMobile.replace(/^\s+|\s+$/g,"");

                // if(!XSH5Utils.funcPhoneNumCheck(userLogName)){
                //     return notificationSrv.funcTankuang('请输入正确的手机号');
                // }
                console.log("密码： ",this.loginPassword);
                // var validate = loginGeetest.getValidate();
                // if(!validate){
                //     return notificationSrv.funcTankuang('验证码验证失败');
                // }else{
                //     var regData = {
                //         "name" : userLogName,
                //         "password" : XSH5Utils.encryptByDES(this.loginPassword),
                //         "geetest_challenge":validate.geetest_challenge,
                //         "geetest_validate":validate.geetest_validate,
                //         "geetest_seccode":validate.geetest_seccode
                //     };
                //     loginRegSrv.funcRegUserLogin(regData, this.funcHideLoginPane);
                // }

            }
        };

        this.login_v = new LoginView();

    }

    module.controller('xsWeb.liveHall.mainCtrl',['$scope', '$timeout', '$state','$interval','xsWeb.common.notificationSrv','xsWeb.liveHall.mainSrv' ,liveHallCtrl])
})(liveHallModule);
