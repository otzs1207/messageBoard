/**
 * Created by NM-029 on 10/20/2016.
 */
commonModule.directive('whenReady', [function() {
    return {
        priority: Number.MIN_SAFE_INTEGER, // execute last, after all other directives if any.
        restrict: "A",
        link: function($scope, $element, $attributes) {
            $scope.$eval($attributes.whenReady); // execute the expression in the attribute.
            // console.log('------------------whenReady:'+$attributes.whenReady);
        }
    };
}]);
