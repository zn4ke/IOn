'use strict';

angular.module('studiApp')
    .controller('MainCtrl', function ($rootScope, $scope, $http, $location, $state, socket) {
        $scope.info='MainCtrl';
        $rootScope.data = {};
        $rootScope.app = {
            showNav: true,
            showControls: false,
            showSidebar: true,
            styles: { sidebarWidth: 3 },
            controls: []
        };

        socket.on('init', function(data){
            console.log('socket handshaking')
            socket.emit('init', { message:'answering handshake' } )
        });

        $scope.$watch('app.showNav', function(){
            $scope.app.styles.wrapperMain = $scope.app.styles.wrapperMain || {};
            $scope.app.styles.wrapperMain.top =  $scope.app.showNav * 48 + "px";
        });
        $scope.$watch('app.showControls', function(){
            $scope.app.styles.wrapperMain = $scope.app.styles.wrapperMain || {};
            $scope.app.styles.wrapperMain.bottom = $scope.app.showControls * 48 + "px";
        });

        $scope.$watch('app.sidebarWidth', function(){
            $scope.app.styles.mainContentClass = "col-xs-" + (12 - $scope.app.styles.sidebarWidth)
            $scope.app.styles.sidebarClass = "col-xs-" + $scope.app.styles.sidebarWidth
        });

        $scope.goTo = function(path){
            $location.path(path)
        };
    });
