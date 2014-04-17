'use strict';

angular.module('studiApp')
    .controller('NavbarCtrl', function ($scope, $location, Auth) {
        $scope.info='NavbarCtrl';
        $scope.menu = [{
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
            'link': '/admin/decks',
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
