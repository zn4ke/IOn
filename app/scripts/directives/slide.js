'use strict';

angular.module('ionApp')
    .directive('slidePreview', function () {
        return {
            templateUrl: 'partials/slide-preview.html',
            restrict: 'E',
            link: function postLink(scope, element, attrs) {
                // linking
            }
        };
    });


angular.module('ionApp')
    .directive('playerControls', function () {
        return {
            templateUrl: 'partials/player-controls.html',
            restrict: 'E',
            link: function postLink(scope, element, attrs) {
                // linking
            }
        };
    });