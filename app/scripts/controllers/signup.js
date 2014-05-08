'use strict';

angular.module('studiApp')
.controller('SignupCtrl', function ($rootScope, $scope, Auth, $location) {

    $scope.role = Auth.userRoles.user;
    $scope.userRoles = Auth.userRoles;

    $scope.register = function() {
        Auth.register({
                name: $scope.name,
                password: $scope.password,
                email: $scope.email,
                role: $scope.role
            },
            function() {
                $location.path('/');
            },
            function(err) {
                $rootScope.error = err;
            });
    };



    // $scope.user = {};
    // $scope.errors = {};

    // $scope.register = function(form) {
    //     $scope.submitted = true;
  
    //     if(form.$valid) {
    //         Auth.createUser({
    //             name: $scope.user.name,
    //             email: $scope.user.email,
    //             password: $scope.user.password
    //         })
    //         .then( function() {
    //             // Account created, redirect to home
    //             $apply();location.path('/');
    //         })
    //         .catch( function(err) {
    //             err = err.data;
    //             $scope.errors = {};

    //           // Update validity of form fields that match the mongoose errors
    //             angular.forEach(err.errors, function(error, field) {
    //                 form[field].$setValidity('mongoose', false);
    //                 $scope.errors[field] = error.type;
    //             });
    //         });
    //     }
    // };
});