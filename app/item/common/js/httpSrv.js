/**
 * Created by hf-mini on 15/11/17.
 */
commonModule.factory('xsWeb.common.httpSrv', ['$http','$q','$window','$location','$rootScope', 'xsWeb.common.notificationSrv',
        function ($http, $q, $window,$location,$rootScope, notificationSrv) {

            //加载小菊花是否显示
            function httpService(xsConfig, ignoreToken){
                // showLoading();
                var success = function (response) {
                    //隐藏加载菊花
                    // hideLoading();
                    if(response.data.status.statuscode=="-998"){
                        //session过期
                        var message;
                        window.localStorage.removeItem("hrtk");
                        var indexPath = window.location.protocol + "//" + window.location.host;
                        if(message = response.data.status.message){
                            alert(message);
                        }
                        window.location= indexPath;
                        return;
                    }
                    //过滤掉message中括号
                    if(response.data.status.statuscode != 0){
                        response.data.status.message = response.data.status.message.replace('[', '');
                        response.data.status.message = response.data.status.message.replace(']', '');
                    }
                    if(xsConfig.success) {
                        if(response.data && response.data.data && response.data.data['dat' + 'a1']) {
                            var str = XSH5Utils.decryptResponse(response.data.data['dat' + 'a1']);
                            response.data.data = eval('(' + str + ')')
                        }
                        xsConfig.success(response.data);
                    }
                };
                var failure = function (response) {
                    //隐藏加载菊花
                    // hideLoading();
                    if(xsConfig.error) {
                        xsConfig.error(response);
                    }
                    //$rootScope.showAlert("获取数据失败,请检查您的网络连接并刷新页面...");
                };
                //encrypt(xsConfig);
                $http(xsConfig).then(success, failure);
            }

            var getConfig = XSH5Utils.getHttpConfig.bind(XSH5Utils);

            function get (url, success, error, ignoreToken) {
                var xsConfig = getConfig( "GET", url, success, error);
                httpService(xsConfig, ignoreToken);
            }

            function getSync(url, suc, err) {
                var xsConfig = getConfig("GET", url, suc, err);
                xsConfig.async = false;
                $.ajax(xsConfig);
            }

            function post (url, data, success, error, ignoreToken) {
                var xsConfig = getConfig( "POST", url, success, error, data);
                httpService(xsConfig, ignoreToken);
            }

            function postPhp(url, data, success, error) {
                var xsConfig = getConfig( "POST", url, success, error, data);
                xsConfig.headers['Content-Type'] = "application/x-www-form-urlencoded";
                xsConfig.headers['Access-Control-Allow-Origin']= "*";
                httpService(xsConfig, true);
            }

            function put (url, data, success, error, ignoreToken) {
                var xsConfig = getConfig( "PUT", url, success, error, data);
                httpService(xsConfig, ignoreToken);
            }

            function _delete(url, success, error, ignoreToken) {
                var xsConfig = getConfig( "DELETE", url, success, error);
                httpService(xsConfig, ignoreToken);
            }
            /**
             * 检查返回结果是否正确 如果不正确提示错误信息
             * @param response
             * @returns {boolean}
             */
            function checkResponseStatus (response) {
                if (response && response.status && response.status.statuscode == "0") {
                    return true;
                } else {
                    //session 过期
                    if(response && response.status && response.status.statuscode == "-100"){
                        notificationSrv.funcTankuang('会话过期请先登录');
                    } else if (response && response.status && response.status.message) {
                        notificationSrv.funcTankuang(response.status.message);
                    }
                    return false;
                }
            }

            return {
                get : get,
                post : post,
                put : put,
                delete : _delete,
                getSync : getSync,
                postPhp : postPhp,
                checkResponseStatus:checkResponseStatus
            }
        }]);
