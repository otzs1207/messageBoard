 /**
 * Created by hf-mini on 15/11/27.
 */
angular.module('xsWeb.common')
    .factory('xsWeb.common.uploadSrv',['$http',"$q", "$log",'$window',
        function($http,$q, $log, $window)
        {
            function httpService(upConfig){
                var success = function (response) {
                    if(upConfig.success) {
                        upConfig.success(response.data);
                    }
                };
                var failure = function (response) {
                    if(upConfig.error) {
                        upConfig.error(response);
                    }
                };
                $http(upConfig).then(success, failure);
            }
            function getUploadConfig(url,data, success, error) {
                var zpConfig = {};
                zpConfig.method = 'POST';
                zpConfig.url = url;
                zpConfig.data = data;
                zpConfig.success = success;
                zpConfig.error = error;
                zpConfig.headers = {};
                zpConfig.headers['Content-Type'] = "undefined";
                zpConfig.transformRequest = angular.identity;
                return zpConfig;
            }

            var onLoad = function(reader, deferred, scope) {
                return function () {
                    scope.$apply(function () {
                        deferred.resolve(reader.result);
                    });
                };
            };
            var onError = function (reader, deferred, scope) {
                return function () {
                    scope.$apply(function () {
                        deferred.reject(reader.result);
                    });
                };
            };
            var getReader = function(deferred, scope) {
                var reader = new FileReader();
                reader.onload = onLoad(reader, deferred, scope);
                reader.onerror = onError(reader, deferred, scope);
                return reader;
            };
            var readAsDataURL = function (file, scope) {
                var deferred = $q.defer();
                var reader = getReader(deferred, scope);
                reader.readAsDataURL(file);
                return deferred.promise;
            };


            //用户头像图片
            function uploadImage(url,fd,success)
            {
                $.ajax({
                    url:XSH5Utils.addTimestamp(url),
                    data: fd,
                    beforeSend: function(request) {
                        request.setRequestHeader("web_did", $window.localStorage.web_did);
                    },
                    type : 'POST',
                    contentType: false,
                    processData: false,
                    success : success
                });
                //var upConfig = getUploadConfig(url,fd,success);
                //httpService(upConfig);
            }
            return {
                readAsDataUrl: readAsDataURL,
                uploadImage:uploadImage
            };
        }
    ]);