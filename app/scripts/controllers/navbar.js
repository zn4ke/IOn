'use strict';

angular.module('studiApp')
    .controller('NavbarCtrl', function ($scope, $location, Auth) {
        $scope.info='NavbarCtrl';
        $scope.app.nav = [{
            'title': 'Home',
            'link': '/'
        }, {
            'title': 'Enter',
            'link': '/enter'
        }, {
            'title': 'Events',
            'link': '/join'
        }, {
            'title': 'Admin',
            'link': '/admin',
            'access': 'admin'
        },{
            'title': 'Player',
            'link': '/player',
            'access': 'admin'
        }];
        
        $scope.logout = function() {
          Auth.logout()
                .then(function() {
                $location.path('/login');
            });
        };
        
        $scope.isActive = function(route) {
            return route === $location.path();
        };
    });
