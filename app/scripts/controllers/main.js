'use strict';


angular.module('ionApp')
.controller('MainAppCtrl', function ($rootScope, $scope, Window, Selection, $timeout) {
    $scope.info='MainAppCtrl';
    console.log('init MainAppCtrl');

    $scope.data = {};


    $rootScope.selection = Selection;
    $rootScope.window = Window;

    $scope.test = function() {
        var rnd = Math.random()
        rnd = Math.floor(rnd*12)
        console.log('test function')

        Window.set('showSidebar', true)
        Window.set('sidebarWidth', rnd)

        // Window.showNav();
        // Window.showControls();
        // $timeout(function(){
        //     Window.showNav();
        // }, 1000)
        // $timeout(function(){
        //     Window.showControls();
        // }, 2000)
    };


    // $scope.openTab = function(path){
    //     window.open(path, 'presentation', 'menubar=no,titlebar=no');
    // };


    // socket.on('init', function(data){
    //     var event = $cookieStore.get('event');
    //     socket.emit('init', { message:'answering handshake' } )
    //     if ( event ) socket.emit('event:join', { id: event })
});



angular.module('ionApp')
.controller('WindowCtrl', function ( $scope ) {
    $scope.info='WindowCtrl';
    console.log('init WindowCtrl');


});

