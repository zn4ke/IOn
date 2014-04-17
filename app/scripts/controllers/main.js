'use strict';

angular.module('studiApp')
    .controller('MainCtrl', function ($scope, $http, $location, socket) {
        $scope.info='MainCtrl';
        $scope.data = {};
        socket.on('init', function(data){
            console.log('socket handshaking')
            socket.emit('init', { message:'answering handshake' } )
        });
        $scope.goTo = function(path){
            $location.path(path)
        };
    });
