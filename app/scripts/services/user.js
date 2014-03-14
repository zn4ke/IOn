'use strict';

angular.module('studiApp')
    .factory('User', function ($resource) {
        return $resource('/api/users/:id', {
            id: '@id'
            }, { //parameters default
                update: {
                    method: 'PUT',
                    params: {}
                },
                get: {
                    method: 'GET',
                    params: {
                        id:'me'
                    }
                },
                list: {
                    isArray: true,
                    method: 'GET',
                    params: {
                        id:'list'
                    }
            }
        });
    });
