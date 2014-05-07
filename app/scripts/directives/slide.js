'use strict';

angular.module('studiApp')
    .directive('slidePreview', function () {
        return {
            templateUrl: 'partials/slide-preview.html',
            restrict: 'E',
            link: function postLink(scope, element, attrs) {
                // linking
            }
        };
    });


angular.module('studiApp')
    .directive('playerControls', function () {
        return {
            templateUrl: 'partials/player-controls.html',
            restrict: 'E',
            link: function postLink(scope, element, attrs) {
                // linking
            }
        };
    });