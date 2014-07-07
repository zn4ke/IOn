'use strict';

angular.module('ionApp')
.directive('uiDraggable', function () {
    return {
        // A = attribute, E = Element, C = Class and M = HTML Comment
        restrict:'A',
        link: function(scope, element, attrs) {


            element.draggable({
                revert:true
            });


        }
    };
});

'use strict';

angular.module('ionApp')
.directive('uiDroppable', function () {
    return {
        templateUrl: 'partials/slide-preview.html',
        restrict: 'E',
        link: function postLink(scope, element, attrs) {
            element.droppable({
                accept: ".itemHeader",
                hoverClass: "drop-hover",
                drop:function(event,ui) {
                    
                }
            });

        }
    };
});