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
      'title': 'State1',
      'link': '/state1'
    }, {
      'title': 'Admin',
      'link': '/admin',
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
