'use strict';

angular.module('studiApp')
    .controller('PlayerCtrl', function ($scope, $cookieStore, Db, Template, socket) {
        $scope.app.showControls = true;
        $scope.app.styles.sidebarWidth = 0;
        $scope.app.player = $scope.app.player || {
            activeSlideNr: 0, 
            zoomFactor: 100, 
            locked: false 
        };

        $scope.app.player.event = Db.event.get( { id: $cookieStore.get('event') }, function(){
            $scope.data.activeSlide = $scope.app.player.event.deck.slides[ $scope.app.player.activeSlideNr ];
            Template.getPres( $scope.app.player.event.deck.slides[$scope.app.player.activeSlideNr].type, function(data){
                $scope.app.player.presentation = data
            });
            $scope.app.player.notes = $scope.app.player.event.deck.slides[$scope.app.player.activeSlideNr].notes;
        });






        $scope.$watch('app.player.activeSlideNr', function(){
            if ($scope.app.player.event.deck){
                if ( $scope.app.player.activeSlideNr <= 0 ){
                    $scope.app.player.activeSlideNr = 0;
                }

                if ( $scope.app.player.activeSlideNr > $scope.app.player.event.deck.slides.length - 1 ){
                    $scope.app.player.activeSlideNr = $scope.app.player.event.deck.slides.length - 1;
                }
                else {
                    $scope.data.activeSlide = $scope.app.player.event.deck.slides[ $scope.app.player.activeSlideNr ];
                    Template.getPres( $scope.app.player.event.deck.slides[$scope.app.player.activeSlideNr].type, function(data){
                        $scope.app.player.presentation = data
                    });
                    Template.getMobile( $scope.app.player.event.deck.slides[$scope.app.player.activeSlideNr].type, function(data){
                        $scope.app.player.mobile = data
                    });
                    // Template.getStats( $scope.app.player.event.deck.slides[$scope.app.player.activeSlideNr].type, function(data){
                    //     $scope.app.player.stats = data
                    // });
                    $scope.app.player.notes = $scope.app.player.event.deck.slides[$scope.app.player.activeSlideNr].notes;
                };

                if ($scope.app.player.locked) {
                    socket.emit( "event:push", {
                        id: $scope.app.player.event._id,
                        presentation: $scope.app.player.presentation,
                        mobile: $scope.app.player.mobile,
                        activeSlide: $scope.data.activeSlide
                    });
                }

            }

        });
        socket.on('event:push', function(data){
            console.log('pushing recieved')
        });
        
        $scope.$watch('app.player.zoomFactor', function(newValue, oldValue) {
            $scope.zoomStyle = {
                'zoom': newValue + '%',
                '-moz-transform': 'scale(' + newValue/100 + ')'
            };

        });

        $scope.$on('$destroy', function() {
            $scope.app.showControls = false;
            //$scope.app.styles.sidebarWidth = 100;
        });
    });



angular.module('studiApp')
    .controller('PresentationCtrl', function ($scope, $cookieStore, Db, Template, socket ) {
        $scope.eventId = $cookieStore.get('event')
        $scope.info = 'PresentationCtrl'
        $scope.app.showNav = false;
        $scope.app.styles.sidebarWidth = 0;

        console.log('event', $scope.event)
        socket.emit( 'event:join', { id: $scope.eventId } )

        socket.on('event:push', function(data){
            console.log('pushing recieved in presentation')
        });




        $scope.$on('$destroy', function() {
            $scope.app.showNav = true;
            $scope.app.styles.sidebarWidth = 100;
        });
    });

angular.module('studiApp')
    .controller('MobileCtrl', function ($scope, $cookieStore, Db, Template, socket ) {
        
        $scope.app.showNav = false;
        $scope.app.styles.sidebarWidth = 0;
        console.log($cookieStore.get('event'))

        socket.on('event:push', function(data){
            console.log('pushing recieved')
        });




        $scope.$on('$destroy', function() {
            $scope.app.showNav = true;
            $scope.app.styles.sidebarWidth = 100;
        });
    });