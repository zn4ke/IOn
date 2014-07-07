'use strict';

angular.module('ionApp')
.factory('Auth', function Auth($rootScope, $http, User, $cookieStore) {

    var accessLevels = routingConfig.accessLevels
            , userRoles = routingConfig.userRoles
            , currentUser;

    // Get currentUser from cookie
    currentUser = $cookieStore.get('user') || { name: 'Gast', role: userRoles.public };
    $cookieStore.remove('user');

    function changeUser(user) {
        angular.extend(currentUser, user);
        $rootScope.currentUser = currentUser;
    }



    return {

        authorize: function(accessLevel, role) {
            if(role === undefined) {
                role = currentUser.role;
            }
            return accessLevel.bitMask & role.bitMask;
        },
        isLoggedIn: function(user) {

            if(user === undefined) {
                user = currentUser;
            }
            return user.role.title === userRoles.user.title || user.role.title === userRoles.admin.title;
        },
        register: function(user, success, error) {
            $http.post('/api/users', user).success(function(res) {
                changeUser(res);
                success();
            }).error(error);
        },
        login: function(user, success, error) {
            $http.post('/api/session', user).success(function(user){
                changeUser(user);
                success(user);
            }).error(error);




        },
        logout: function(success, error) {
            $http.delete('/api/session').success(function(){
                changeUser({
                    name: '',
                    role: userRoles.public
                });
                success();
            }).error(error);
        },
        accessLevels: accessLevels,
        userRoles: userRoles,
        user: currentUser

    };
});