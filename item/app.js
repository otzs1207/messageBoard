var xsWeb = angular.module("xsWeb", [
    'ui.router',
    'ui.bootstrap',
    'ngTouch',
    'ngScrollbar',
    'xsWeb.common',
    'xsWeb.liveHall',
    'xsWeb.room',
    'xsWeb.loginReg',
    'xsWeb.user',
    'xsWeb.others',
    'xsWeb.shop',
    'xsWeb.rank'
]);

xsWeb.run(
    ['$rootScope', '$state', '$stateParams','$window',
        function ($rootScope, $state, $stateParams,$window) {
            if (angular.isUndefined(window.localStorage.hrtk) || window.localStorage.hrtk === null) {
            }
            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;
        }
    ]);

angular.element(document).ready(function () {
    envVar.isSupportCss3Animation = (document.body.style.animationName !== undefined);
});
