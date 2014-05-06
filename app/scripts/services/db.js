'use strict';

angular.module('studiApp')
    .service('Db', function Db($resource) {
        // AngularJS will instantiate a singleton by calling "new" on this function
        return {
            deck: $resource('/api/db/deck/:id', {
                id: '@id'
                }, { //parameters default
                update: {
                    method: 'PUT',
                    params: { }
                },
                get: {
                    method: 'GET',
                    params: {
                        //id:'me'
                    }
                },
                list: {
                    isArray: true,
                    method: 'GET',
                    params: {
                        id:'list'
                    }
                }
            }),
            group: $resource('/api/db/group/:id', {
                id: '@id'
                }, { //parameters default
                update: {
                    method: 'PUT',
                    params: {}
                },
                get: {
                    method: 'GET',
                    params: {
                        //id:'me'
                    }
                },
                list: {
                    isArray: true,
                    method: 'GET',
                    params: {
                        id:'list'
                    }
                }
            }),
            event: $resource('/api/db/event/:id', {
                id: '@id'
                }, { //parameters default
                update: {
                    method: 'PUT',
                    params: {}
                },
                get: {
                    method: 'GET',
                    // params: {
                    //     id:'me'
                    // }
                },
                list: {
                    isArray: true,
                    method: 'GET',
                    params: {
                        id:'list'
                    }
                }
            }),
            slide: $resource('/api/db/slide/:id', {
                id: '@id'
                }, { //parameters default
                update: {
                    method: 'PUT',
                    params: {}
                }
            })
        };
    });
