'use strict';

angular.module('ionApp')
.controller('LoginCtrl', function ($rootScope, $scope, Auth, $location) {
    $scope.user = {};
    $scope.errors = {};

    // TODO: remove this
    $scope.username = "Admin";
    $scope.email = "admin@studi.ch";
    $scope.password = "12345";
    $scope.rememberme = true;

    $scope.login = function(form) {
        Auth.login({
                username: $scope.username,
                email: $scope.email,
                password: $scope.password,
                rememberme: $scope.rememberme
            },
            function(res) {
                $location.path('/');
            },
            function(err) {
                $rootScope.error = "Failed to login";
            });
    }
});