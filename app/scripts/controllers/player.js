'use strict';

angular.module('studiApp')
    .controller('PlayerCtrl', function ($scope, $cookieStore, Db, Template) {
        $scope.app.showControls = true;
        $scope.app.sidebarWidth = 0;
        $scope.app.player = $scope.app.player || { activeSlideNr: 0 };
        $scope.app.player.event = Db.event.get( { id: $cookieStore.get('event') }, function(){
            console.log('dasdasdasdd')
            $scope.activeSlide = $scope.app.player.event.deck.slides[ $scope.app.player.activeSlideNr ];
            Template.getPres( $scope.app.player.event.deck.slides[$scope.app.player.activeSlideNr].type, function(data){
                $scope.app.player.presentation = data
            });
        });

        $scope.app.controls = [
            {
                icon: 'step-backward',
                action: function(){
                    ($scope.app.player.activeSlideNr <= 0) 
                        ? $scope.app.player.activeSlideNr = 0
                        : $scope.app.player.activeSlideNr--;
                }
            },{
                icon: 'step-forward',
                action: function(){
                    ($scope.app.player.activeSlideNr >= $scope.app.player.event.deck.slides.length - 1) 
                        ? $scope.app.player.activeSlideNr = 0
                        : $scope.app.player.activeSlideNr++;
                }
            },{
                icon: 'facetime-video',
                action: function(){
                    window.open('/presentation', '_blank');
                }
            }
        ]
        $scope.$watch('app.player.activeSlideNr', function(){
            if ($scope.app.player.event.deck){
                $scope.activeSlide = $scope.app.player.event.deck.slides[ $scope.app.player.activeSlideNr ];
                Template.getPres( $scope.app.player.event.deck.slides[$scope.app.player.activeSlideNr].type, function(data){
                    $scope.app.player.presentation = data
                });
            }

        });
        $scope.$on('$destroy', function() {
            $scope.app.showControls = false;
            $scope.app.sidebarWidth = 100;
        });
    });



angular.module('studiApp')
    .controller('PresentationCtrl', function ($scope, $cookieStore, Db, Template, socket ) {
        $scope.app.showNav = false;
        $scope.app.sidebarWidth = 0;
        console.log('presentation ctrl')
    });