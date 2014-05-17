'use strict';

angular.module('ionApp')
    .service('Template', function($http) {
        var templates = {
            mobile: { 'slide-simple':'', 'slide-mc':'', 'slide-yun':'' },
            pres: { 'slide-simple':'', 'slide-mc':'', 'slide-yun':'' },
            stats: { 'bar-chart':'' }
        };

        loadTemplates()
        
        function loadTemplates(){
            angular.forEach(templates.pres, function(value, key){
                $http({method: 'GET', url: '/partials/slides/' + key + "-pres.html"})
                    .success(function(data){
                        templates.pres[key] = data;
                    });
            });
            angular.forEach(templates.mobile, function(value, key){
                $http({method: 'GET', url: '/partials/slides/' + key + "-mobile.html"})
                    .success(function(data){
                        templates.mobile[key] = data;
                    });
            });
            angular.forEach(templates.stats, function(value, key){
                $http({method: 'GET', url: '/partials/stats/' + key + ".html"})
                    .success(function(data){
                        templates.stats[key] = data;
                    });
            });

        };
        var serviceObject = {
            getForm: function( type, callback){
                var apiUrl = 'partials/forms' + type + '.html';
                var form = $http({method: 'GET', url: 'partials/slides/slide-simple-pres.html'}).
                    success(function(data, status, headers, config) {
                      // this callback will be called asynchronously
                      // when the response is available
                        callback(data, status, headers, config);
                    })

            },
            getPres: function( type, callback){
                var apiUrl = 'partials/'
                apiUrl += 'slides/' + type + '-pres.html';
                
                var form = $http({method: 'GET', url: apiUrl}).
                    success(function(data, status, headers, config) {
                      // this callback will be called asynchronously
                      // when the response is available
                        callback(data, status, headers, config);
                    })

            },
            getMobile: function( type, callback){
                var apiUrl = 'partials/'
                apiUrl += 'slides/' + type + '-mobile.html';
                var form = $http({method: 'GET', url: apiUrl }).
                    success(function(data, status, headers, config) {
                      // this callback will be called asynchronously
                      // when the response is available
                        callback(data, status, headers, config);
                    })

            },
            get: templates
        }

        return serviceObject;
    });
