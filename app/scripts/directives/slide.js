'use strict';

angular.module('studiApp')
    .directive('slidePreview', function () {
        return {
            templateUrl: 'partials/slide-preview.html',
            restrict: 'E',
            link: function postLink(scope, element, attrs) {
                //element.text('this is the slide directive');
                console.log('link slide')
            }
        };
    });


angular.module('studiApp')
    .directive('playerControls', function () {
        return {
            templateUrl: 'partials/player-controls.html',
            restrict: 'E',
            link: function postLink(scope, element, attrs) {
                //element.text('this is the slide directive');
                console.log('link player controlls')
            }
        };
    });