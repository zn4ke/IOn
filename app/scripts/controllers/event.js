'use strict';

angular.module('ionApp')
    .controller('ViewerCtrl', function ($scope, $resource, $location, $cookieStore, Db, socket) {
        $scope.data.viewer = $scope.data.viewer || {};
        $scope.data.events = {
            my: $resource('/api/db/event/list', { what:'membership' } ).query(),
            pub: $resource('/api/db/event/list', { what:'pub' } ).query()
        };
        console.log('eventCtrl init');
        $scope.joinEvent = function(scope) {
            $scope.data.viewer.event = Db.event.get({ id: scope.event._id })
            $cookieStore.put( 'event', scope.event._id )
            socket.emit('event:join', { id: scope.event._id })
            $location.path('/mobile');
        }
    });
