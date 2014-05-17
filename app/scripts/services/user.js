'use strict';

angular.module('ionApp')
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

angular.module('ionApp')
    .factory('File', function ($resource) {
        var files = $resource('/files/:id', {
            id: '@id'
            }, { //parameters default
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
                },
                delete: {
                    method: 'DELETE',
                    params: {
                        //id:'@id'
                    }
                }
        });
        return files
    });