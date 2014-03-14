'use strict';

angular.module('studiApp')
    .controller('MainCtrl', function ($scope, $http, $location) {
        $scope.info='MainCtrl';
        
        $scope.goTo = function(path){
            $location.path(path)
        };
    });
