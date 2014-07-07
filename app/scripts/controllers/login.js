'use strict';

angular.module('ionApp')
.controller('LoginCtrl', function ($rootScope, $scope, Auth, $location) {
    console.log('init LoginCtrl')
    $scope.info="LoginCtrl";
    $scope.user = {};
    $scope.errors = {};

    // TODO: remove this
    $scope.username = "Admin";
    $scope.email = "admin@studi.ch";
    $scope.password = "12345";
    $scope.rememberme = true;

    $scope.login = function(form) {
        var user = {
            username: $scope.username,
            email: $scope.email,
            password: $scope.password,
            rememberme: $scope.rememberme
        }
        Auth.login(user,
            function(res) {
                $location.path('/');
            },
            function(err) {
                $rootScope.error = "Failed to login";
            });
    }
});