'use strict';

angular.module('studiApp')
    .controller('NavbarCtrl', function ($scope, $location, Auth) {
        $scope.info='NavbarCtrl';
        $scope.app.nav = [{
            'title': 'Home',
            'sref': 'home'
        }, {
            'title': 'Events',
            'sref': 'join'
        }, {
            'title': 'Admin',
            'sref': 'admin',
            'access': 'admin'
        },{
            'title': 'Player',
            'sref': 'player',
            'access': 'admin'
        }];
        
        $scope.logout = function() {
          Auth.logout()
                .then(function() {
                $location.path('/login');
            });
        };
    });
