'use strict';

angular.module('studiApp')
    .controller('PlayerCtrl', function ($scope, $cookieStore, Db, Template, socket) {
        $scope.app.showControls = true;
        $scope.eventId = $cookieStore.get('event')
        $scope.app.styles.sidebarWidth = 0;
        $scope.app.player = $scope.app.player || {
            activeSlideNr: 0, 
            zoomFactor: 100, 
            locked: false 
        };

        $scope.app.player.event = Db.event.get( { id: $scope.eventId }, function(){
            $scope.data.activeSlide = $scope.app.player.event.deck.slides[ $scope.app.player.activeSlideNr ];
            Template.getPres( $scope.app.player.event.deck.slides[$scope.app.player.activeSlideNr].type, function(data){
                $scope.app.player.presentation = data
            });
            $scope.app.player.notes = $scope.app.player.event.deck.slides[$scope.app.player.activeSlideNr].notes;
        });

        socket.emit( 'event:join', { id: $scope.eventId } )




        $scope.$watch('app.player.activeSlideNr', function(){
            if ($scope.app.player.event.deck){
                if ( $scope.app.player.activeSlideNr <= 0 ){
                    $scope.app.player.activeSlideNr = 0;
                }

                if ( $scope.app.player.activeSlideNr > $scope.app.player.event.deck.slides.length - 1 ){
                    $scope.app.player.activeSlideNr = $scope.app.player.event.deck.slides.length - 1;
                }
                else {
                    var type = $scope.app.player.event.deck.slides[$scope.app.player.activeSlideNr].type
                    $scope.data.activeSlide = $scope.app.player.event.deck.slides[ $scope.app.player.activeSlideNr ];
                    $scope.app.player.presentation = Template.get.pres[type]
                    $scope.app.player.mobile = Template.get.mobile[type]
                    $scope.app.player.stats = Template.get.stats['bar-chart']

                    if ($scope.app.player.locked) {
                        $scope.app.player.pushSlide();
                        // socket.emit( "event:push", {
                        //     id: $scope.app.player.event._id,
                        //     presentation: $scope.app.player.presentation,
                        //     mobile: $scope.app.player.mobile,
                        //     activeSlide: $scope.data.activeSlide
                        // });
                    }
                    $scope.app.player.notes = $scope.app.player.event.deck.slides[$scope.app.player.activeSlideNr].notes;
                };
            }
        });

        $scope.app.player.pushSlide = function(index){

            var slideNr = index || $scope.app.player.activeSlideNr;
            var slide = $scope.app.player.event.deck.slides[slideNr];

            console.log('pushing slide', slideNr)

            socket.emit( "event:push", {
                id: $scope.app.player.event._id,
                presentation: Template.get.pres[slide.type],
                mobile: Template.get.mobile[slide.type],
                slideNr: slideNr,
                activeSlide: slide
            });
        };

        socket.on('event:push', function(data){
            console.log('pushing recieved')
        });
        socket.on('event:answer', function(data){
            console.log('user:', data.user, 'submitted answer', data)
        });
        
        $scope.$watch('app.player.zoomFactor', function(newValue, oldValue) {
            $scope.app.player.zoomStyle = {
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

        $scope.app.player = $scope.app.player || {
            activeSlideNr: 0, 
            zoomFactor: 100, 
            locked: false 
        };


        $scope.eventId = $cookieStore.get('event')
        $scope.info = 'PresentationCtrl'
        $scope.app.showNav = false;
        $scope.app.styles.sidebarWidth = 0;

        socket.emit( 'event:join', { id: $scope.eventId } )

        socket.on('event:push', function(data){
            console.log('pushing recieved in presentation')
            $scope.templates = {
                mobile: data.mobile,
                presentation: data.presentation
            };
            $scope.data.activeSlide = data.activeSlide;
        });

        $scope.$watch('app.player.zoomFactor', function(newValue, oldValue) {
            $scope.app.player.zoomStyle = {
                'zoom': newValue + '%',
                '-moz-transform': 'scale(' + newValue/100 + ')'
            };

        });


        $scope.$on('$destroy', function() {
            $scope.app.showNav = true;
            $scope.app.styles.sidebarWidth = 100;
        });
    });

angular.module('studiApp')
    .controller('MobileCtrl', function ($scope, $http, $cookieStore, Db, Template, socket ) {

        $scope.app.player = $scope.app.player || {
            activeSlideNr: 0, 
            zoomFactor: 100, 
            locked: false 
        };


        $scope.app.showNav = false;
        $scope.app.styles.sidebarWidth = 0;
        $scope.eventId = $cookieStore.get('event')
        socket.emit( 'event:join', { id: $scope.eventId } )

        socket.on('event:push', function(data){
            
            $scope.templates = {
                mobile: data.mobile,
                presentation: data.presentation
            };
            $scope.data.activeSlide = data.activeSlide;
            console.log('pushing recieved in mobile', data)
        });


        $scope.sendAnswer = function(answer){
            $http.post('/submit', {
                    id: $scope.eventId,
                    slideNr: 0,
                    answer: answer,
                })
                .success(function(){
                    console.log('success: result posted')
                })
                .error(function(){
                    console.log('error: posting result failed')
                });
            socket.emit('event:answer', {
                id: $scope.eventId,
                slideNr: 0,
                answer: answer

            });
        }

        $scope.$watch('app.player.zoomFactor', function(newValue, oldValue) {
            $scope.app.player.zoomStyle = {
                'zoom': newValue + '%',
                '-moz-transform': 'scale(' + newValue/100 + ')'
            };

        });


        $scope.$on('$destroy', function() {
            $scope.app.showNav = true;
            $scope.app.styles.sidebarWidth = 100;
        });
    });


angular.module('studiApp')
    .controller('StatsCtrl', function ($scope, $cookieStore, Db, Template, socket ) {
        $scope.testData=[[[]]];
        $scope.testOptions = {
            title: 'myGraph',
            axes:{
                //yaxis:{min:-10, max:240}
            },
            series:[{color:'#5FAB78'}]
        };
        $scope.updateChart = function(){
            var newVal =[Math.random(),Math.random()]
            console.log('update chart', newVal)
            $scope.testData[0].push(newVal);
        }

    });