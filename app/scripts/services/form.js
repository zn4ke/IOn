'use strict';

angular.module('studiApp')
    .service('Template', function($http) {
        var serviceObject = {
            getForm: function( type, callback){
                var apiUrl = 'partials/forms' + type + '.html';
                var form = $http({method: 'GET', url: 'partials/slides/slide-simple-pres.html'}).
                    success(function(data, status, headers, config) {
                      // this callback will be called asynchronously
                      // when the response is available
                        callback(data, status, headers, config);
                    }).
                    error(function(data, status, headers, config) {
                      // called asynchronously if an error occurs
                      // or server returns response with an error status.
                    });

            },
            getPres: function( type, callback){
                var apiUrl = 'partials/'
                apiUrl += 'slides/' + type + '-pres.html';
                
                var form = $http({method: 'GET', url: apiUrl}).
                    success(function(data, status, headers, config) {
                      // this callback will be called asynchronously
                      // when the response is available
                        callback(data, status, headers, config);
                    }).
                    error(function(data, status, headers, config) {
                      // called asynchronously if an error occurs
                      // or server returns response with an error status.
                    });

            },
            getMobile: function( type, callback){
                var apiUrl = 'partials/'
                apiUrl += 'slides/' + type + '-mobile.html';
                var form = $http({method: 'GET', url: apiUrl }).
                    success(function(data, status, headers, config) {
                      // this callback will be called asynchronously
                      // when the response is available
                        callback(data, status, headers, config);
                    }).
                    error(function(data, status, headers, config) {
                      // called asynchronously if an error occurs
                      // or server returns response with an error status.
                    });

            }
        }

        return serviceObject;
    });
