'use strict';

angular.module('studiApp')
    .controller('SlidePreviewCtrl', function ($scope, $location, Template) {
        console.log($scope.data.decks)
        $scope.activeSlideNr = -1;
        $scope.zoomFactor = 100;
        // Template.getPres( $scope.activeSlide.type, function(data){
        //     $scope.template = data
        //     console.log('template callback', data)
        // })
        //$scope.data.selected.deck = $scope.data.decks[0];
        //$scope.activeSlide = $scope.data.selected.deck.slides[$scope.activeSlideNr] || {};
        $scope.$watch('activeSlideNr', function(newValue, oldValue) {
            if (!$scope.data.selected.deck) return;
            var deckSize = $scope.data.selected.deck.slides.length;
            if ($scope.activeSlideNr < 0) $scope.activeSlideNr = 0;
            if ($scope.activeSlideNr > deckSize - 1) $scope.activeSlideNr = deckSize - 1;
            $scope.activeSlide = $scope.data.selected.deck.slides[$scope.activeSlideNr];

            console.log('getting template', $scope.activeSlide.type)
            
            Template.getPres( $scope.activeSlide.type, function(data){
                $scope.template = data
                console.log('template callback', data)
            });
            Template.getMobile( $scope.activeSlide.type, function(data){
                $scope.templateMobile = data
                console.log('mobile template callback', data)
            });
        });
        $scope.$watch('zoomFactor', function(newValue, oldValue) {
            console.log( 'zoomFactor', $scope.zoomFactor )
            $scope.zoomStyle = { 'zoom': newValue + '%',
                                    '-moz-transform': 'scale(' + newValue/100 + ')'
                                };

        });
        $scope.editSlide = function(scope){
            console.log(scope)
            $scope.data.selected.slide = $scope.activeSlideNr;
            $location.path('admin/edit/' + $scope.activeSlide.type);
        };
    });


var PresController = function(){

};

var MobileCtrl = function(){

};