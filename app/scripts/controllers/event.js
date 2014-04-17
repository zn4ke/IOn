'use strict';

angular.module('studiApp')
    .controller('ViewerCtrl', function ($scope, $resource, $location, Db, socket) {
        $scope.data.viewer = $scope.data.viewer || {};
        $scope.data.events = {
            my: $resource('/api/db/event/list', { what:'membership' } ).query(),
            pub: $resource('/api/db/event/list', { what:'pub' } ).query()
        };
        console.log('eventCtrl init');
        $scope.joinEvent = function(scope) {
            $scope.data.viewer.event = Db.event.get({ id: scope.event._id })

            $location.path('/viewer/' + scope.event._id);
        }
    });
