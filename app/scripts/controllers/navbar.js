'use strict';

angular.module('ionApp')
    .controller('NavbarCtrl', function ($rootScope, $scope, $location, Auth) {
        $scope.info='NavbarCtrl';
        $scope.data.currentUser = Auth.user;
        $scope.user = Auth.user;
        $scope.userRoles = Auth.userRoles;
        $scope.accessLevels = Auth.accessLevels;

        $scope.app.nav = [{
            'title': 'Home',
            'sref': 'user.home',
            'access': Auth.accessLevels.user
        }, {
            'title': 'Veranstaltungen',
            'sref': 'user.join',
            'access': Auth.accessLevels.user
        }, {
            'title': 'Admin',
            'sref': 'admin.admin',
            'access': Auth.accessLevels.admin
        },{
            'title': 'Player',
            'sref': 'admin.player',
            'access': Auth.accessLevels.admin
        },{
            'title': 'Video',
            'sref': 'admin.video',
            'access': Auth.accessLevels.admin
        }];
        
        $scope.logout = function() {
            Auth.logout(function() {
                $location.path('/login');
            }, function() {
                $rootScope.error = "Failed to logout";
            });
        };
    });


angular.module('ionApp')
.controller('LoginCtrl',
['$rootScope', '$scope', '$location', '$window', 'Auth', function($rootScope, $scope, $location, $window, Auth) {

    $scope.rememberme = true;
    $scope.login = function() {
        Auth.login({
                username: $scope.username,
                password: $scope.password,
                rememberme: $scope.rememberme
            },
            function(res) {
                $location.path('/');
            },
            function(err) {
                $rootScope.error = "Failed to login";
            });
    };

    $scope.loginOauth = function(provider) {
        $window.location.href = '/auth/' + provider;
    };
}]);