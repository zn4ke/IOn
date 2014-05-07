'use strict';

angular.module('studiApp')
    .controller('SlidePreviewCtrl', function ($scope, $location, Template) {
        $scope.data.activeSlideNr = -1;
        $scope.zoomFactor = 100;
        $scope.$watch('data.activeSlideNr', function(newValue, oldValue) {
            
            if (!$scope.data.selected.deck || !$scope.data.selected.deck.slides) return;
            
            var deckSize = $scope.data.selected.deck.slides.length;

            if ($scope.data.activeSlideNr < 0) $scope.data.activeSlideNr = 0;
            if ($scope.data.activeSlideNr > deckSize - 1) $scope.data.activeSlideNr = deckSize - 1;
            $scope.data.activeSlide = $scope.data.selected.deck.slides[$scope.data.activeSlideNr];
            
            Template.getPres( $scope.data.activeSlide.type, function(data){
                $scope.template = data
            });
            Template.getMobile( $scope.data.activeSlide.type, function(data){
                $scope.templateMobile = data
            });
        });
        $scope.$watch('zoomFactor', function(newValue, oldValue) {
            $scope.zoomStyle = {
                'zoom': newValue + '%',
                '-moz-transform': 'scale(' + newValue/100 + ')'
            };

        });
        $scope.editSlide = function(scope){
            $scope.data.selected.slide = $scope.data.activeSlideNr;
            $location.path('admin/edit/' + $scope.data.activeSlide.type);
        };
    });


var PresController = function(){

};

var MobileCtrl = function(){

};