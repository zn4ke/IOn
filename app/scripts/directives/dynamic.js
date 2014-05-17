'use strict';

angular.module('ionApp')
    .directive('dynamic', function ($compile) {
        return {
            restrict: 'A',
            replace: true,
            link: function(scope, element, attrs) {
                scope.$watch(attrs.dynamic, function(html) {
                    element.html(html);
                    $compile(element.contents())(scope);
                });

            }
        }
    });


MathJax.Hub.Config({
    skipStartupTypeset: true,
    messageStyle: "none",
    "HTML-CSS": {
        showMathMenu: false
    }
});
MathJax.Hub.Configured();



angular.module('ionApp')
    .directive("mathjaxBind", function() {
        return {
            restrict: "A",
            controller: ["$scope", "$element", "$attrs", function($scope, $element, $attrs) {
                $scope.$watch($attrs.mathjaxBind, function(value) {
                    var $script = angular.element("<script type='math/tex'>")
                        .html(value == undefined ? "" : value);
                    $element.html("");
                    $element.append($script);
                    MathJax.Hub.Queue(["Reprocess", MathJax.Hub, $element[0]]);
                });
            }]
        };
    });



angular.module('ionApp')
    .directive("mjMath", function() {
        return {
            restrict: "E",
            controller: ["$scope", "$element", "$attrs", function($scope, $element, $attrs) {
                
                var $script = angular.element("<script type='math/tex'>")
                $script.html( $element.html() )
                $element.html("");
                $element.html($script);
                MathJax.Hub.Queue(["Reprocess", MathJax.Hub, $element[0]]);
                
            }]
        };
    });