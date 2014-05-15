'use strict';

angular.module('studiApp')
    .controller('SlidePreviewCtrl', function ($scope, $location, Template) {
        $scope.data.selected.slideNr = -1;
        $scope.zoomFactor = 100;
        $scope.app.player = $scope.app.player || {};
        $scope.$watch('data.selected.slideNr', function(newValue, oldValue) {
            
            if (!$scope.data.selected.deck || !$scope.data.selected.deck.slides) return;
            
            var deckSize = $scope.data.selected.deck.slides.length;

            if ($scope.data.selected.slideNr < 0) $scope.data.selected.slideNr = 0;
            if ($scope.data.selected.slideNr > deckSize - 1) $scope.data.selected.slideNr = deckSize - 1;
            $scope.data.selected.slide = $scope.data.selected.deck.slides[$scope.data.selected.slideNr];
            
            $scope.template = Template.get.pres[$scope.data.selected.slide.type];
            $scope.templateMobile = Template.get.mobile[$scope.data.selected.slide.type];
        });
        $scope.$watch('zoomFactor', function(newValue, oldValue) {
            $scope.app.player.zoomStyle = {
                'zoom': newValue + '%',
                '-moz-transform': 'scale(' + newValue/100 + ')'
            };

        });
        $scope.editSlide = function(scope){
            $scope.app.newSlide = false;
            $location.path( 'admin/edit/' + $scope.data.selected.slide.type );
        };
    });


angular.module('studiApp')
.controller('SlideYunCtrl', function ($scope, Yun, $http) {
    // $http.jsonp('http://192.168.188.29/data/get?callback=jsonp_callback')
    //     .success( function(data){
    //         console.log('yun data', data)
    //     })
    $scope.Yun = Yun;
    $scope.records = [[[]]];
    $scope.lightSeries = [];
    $scope.thermoSeries = [];
    $scope.thermoSeries2 = [];

    $scope.address = Yun.address();

    var startTime = 0;

    $scope.yunData = "no data recieved yet";
    $scope.interval = 3000;

    $scope.testOptions = {
        title: 'YUN Daten',

        seriesDefaults:{
            pointLabels: { show: true },
        },
        axes: {
            xaxis: {           pad: 0      },
            yaxis: {           min: 0,           max:1024         },
            y2axis: {           min: 10,           max:60          }
        },
        series:[ 
            {
                // Change our line width and use a diamond shaped marker.
                lineWidth:1, 
                //markerOptions: { style:'dimaond' },
                yaxis: 'yaxis'
            }, 
            {
                // Don't show a line, just show markers.
                // Make the markers 7 pixels with an 'x' style
                //showLine:2, 
                markerOptions: { size: 7, style:"." },
                yaxis: 'y2axis'
            }, 
            {
                // Don't show a line, just show markers.
                // Make the markers 7 pixels with an 'x' style
                //showLine:2, 
                markerOptions: { size: 7, style:"." },
                yaxis: 'y2axis'
            }
        ]
    };


    $scope.getYunData = function( key ){
        Yun.get( key, function(data){
            $scope.yunData = data;
            $scope.$apply();
        })
    }
    $scope.setYunData = function( key, value ){
        Yun.set( key, value, function(data){
            $scope.yunData = data;
            $scope.$apply();
        })
    }
    var timer;
    $scope.toggleRecord = function( key, value ){
        Yun.set( 'rec', $scope.record ? 1 : 0, function(data){
            $scope.yunData = data;
            $scope.$apply();
        });
        if (timer) {
            window.clearInterval(timer);
            timer = null;
        }
        else {
            $scope.lightSeries = [];
            $scope.thermoSeries = [];
            $scope.thermoSeries2 = [];
            timer = window.setInterval( function(){

                Yun.get( function(data){
                    $scope.yunData = data;
                    

                    console.log('resetting timer', !$scope.thermoSeries.length)
                    if (!$scope.thermoSeries.length) startTime = data.value.time / 1000.0;

                    console.log('yunData', $scope.yunData)

                    var time = data.value.time / 1000.0 - startTime;
                    console.log('thermo',data.value.thermo)
                    console.log('thermo2',data.value.thermo2)
                    $scope.lightSeries.push( [ time, data.value.light ] );
                    $scope.thermoSeries.push( [ time, data.value.thermo ] );
                    $scope.thermoSeries2.push( [ time, data.value.thermo2 ] );
                    console.log('$scope.records',$scope.records)
                    $scope.records = [ $scope.lightSeries, $scope.thermoSeries, $scope.thermoSeries2 ];
                    $scope.$apply();
                })
            } , $scope.interval)
        }
    }
});