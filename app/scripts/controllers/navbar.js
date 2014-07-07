'use strict';

angular.module('ionApp')
    .controller('NavbarCtrl', function ($rootScope, $scope, $location, Auth) {
        $scope.info='NavbarCtrl';
        console.log('init NavbarCtrl');
        $scope.user = Auth.user;
        $scope.userRoles = Auth.userRoles;
        $scope.accessLevels = Auth.accessLevels;

        $scope.menu = [
            {
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
                'title': '(Video)',
                'sref': 'admin.video',
                'access': Auth.accessLevels.admin
            },{
                'title': '(Math)',
                'sref': 'admin.math',
                'access': Auth.accessLevels.admin
            },{
                'title': '(Chem)',
                'sref': 'admin.chem',
                'access': Auth.accessLevels.admin
            }
        ];
        
        $scope.logout = function() {
            Auth.logout(function() {
                $location.path('/login');
            }, function() {
                $rootScope.error = "Failed to logout";
            });
        };
    });


