'use strict';

angular.module('ionApp')
.factory('Auth', function Auth($location, $rootScope, $http, Session, User, $cookieStore) {

    var accessLevels = routingConfig.accessLevels
            , userRoles = routingConfig.userRoles
            , currentUser;

    // Get currentUser from cookie
    currentUser = $cookieStore.get('user') || { name: 'Gast', role: userRoles.public };
    $cookieStore.remove('user');

    function changeUser(user) {
        angular.extend(currentUser, user);
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






      /**
       * Authenticate user
       * 
       * @param  {Object}   user     - login info
       * @param  {Function} callback - optional
       * @return {Promise}            
       */
    //    login: function(user, callback) {
    //     var cb = callback || angular.noop;

    //     return Session.save({
    //         email: user.email,
    //         password: user.password
    //     }, function(user) {
    //       $rootScope.currentUser = user;
    //         return cb();
    //     }, function(err) {
    //         return cb(err);
    //     }).$promise;
    // },

      /**
       * Unauthenticate user
       * 
       * @param  {Function} callback - optional
       * @return {Promise}           
       */
    //    logout: function(callback) {
    //     var cb = callback || angular.noop;

    //     return Session.delete(function() {
    //         $rootScope.currentUser = null;
    //         return cb();
    //     },
    //     function(err) {
    //         return cb(err);
    //     }).$promise;
    // },

      /**
       * Create a new user
       * 
       * @param  {Object}   user     - user info
       * @param  {Function} callback - optional
       * @return {Promise}            
       */
    //    createUser: function(user, callback) {
    //     var cb = callback || angular.noop;

    //     return User.save(user,
    //         function(user) {
    //             $rootScope.currentUser = user;
    //             return cb(user);
    //         },
    //     function(err) {
    //         return cb(err);
    //     }).$promise;
    // },

      /**
       * Change password
       * 
       * @param  {String}   oldPassword 
       * @param  {String}   newPassword 
       * @param  {Function} callback    - optional
       * @return {Promise}              
       */
    //    changePassword: function(oldPassword, newPassword, callback) {
    //     var cb = callback || angular.noop;

    //     return User.update({
    //         oldPassword: oldPassword,
    //         newPassword: newPassword
    //     }, function(user) {
    //         return cb(user);
    //     }, function(err) {
    //         return cb(err);
    //     }).$promise;
    // },

      /**
       * Gets all available info on authenticated user
       * 
       * @return {Object} user
       */
        // currentUser: function() {
        //     return User.get();
        // },
      /**
       * Gets all available info on authenticated user
       * 
       * @return {Object} user
       */
        // hasRole: function(role) {
        //     var user = $rootScope.currentUser;
        //     return user && (user.role === role);
        // },
    };
});