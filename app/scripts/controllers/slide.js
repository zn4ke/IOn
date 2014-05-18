'use strict';

angular.module('ionApp')
    .controller('SlidePreviewCtrl', function ($scope, $location, Template) {
        $scope.data.selected.slideNr = -1;
        $scope.zoomFactor = 100;
        $scope.app.player = $scope.app.player || {};
        $scope.$watch('data.selected.slideNr', function(newValue, oldValue) {
            
            if (!$scope.data.selected.deck 
                || !$scope.data.selected.deck.slides
                || !$scope.data.selected.deck.slides[0] ) return;
            
            var deckSize = $scope.data.selected.deck.slides.length;
            var slideNr = $scope.data.selected.slideNr;

            if (slideNr < 0) slideNr = 0;
            if (slideNr > deckSize - 1) slideNr = deckSize - 1;
            $scope.data.selected.slideNr = slideNr;
            console.log('slideNr', slideNr)

            $scope.data.selected.slide = $scope.data.selected.deck.slides[slideNr];
            console.log('$scope.data.selected.slide', $scope.data.selected.slide)
            
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
        $scope.deleteSlide = function(){
            var slideNr = $scope.data.selected.slideNr
            console.log('deleting slide ' + slideNr + " of "+ $scope.data.selected.deck.slides.length)
            
            var confirm = window.confirm( 'Die Folie wird gelöscht' );
            if (!confirm) { return; }
            $scope.data.selected.deck.slides.splice(slideNr, 1)
            $scope.data.selected.deck.$update( function(updatedDeck,arg2){
                console.log('updated deck contains ', $scope.data.selected.deck.slides.length)
                $scope.data.selected.slideNr = slideNr - 1;
            })

            

        };
    });


angular.module('ionApp')
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

angular.module('ionApp')
.controller('MathCtrl', function ($scope) {
    var math = mathjs();
    var fn;
    $scope.mathScope = {};
    $scope.xyData = [];
    for (var i = -10; i<=10; i++){
        $scope.xyData.push([i/10.0,i/10.0]);
    }

    console.log('init MathCtrl')

    $scope.mathInput = "a*x^2+b*x+c";

    $scope.parseMath = function(){
        var tree = math.parse($scope.mathInput);
        fn = tree.compile(math);

        $scope.vars = parseVars(tree.expr)

        // _.each($scope.vars, function(variable){
        //     $scope.mathScope[variable.name] = variable.value
        // });

    }

    function parseVars(tree){
        console.log(MathJax)
        var vars = [];
        parseNode(tree);
        function parseNode(node){

            _.each(node, function(obj, key){

                if ( key === 'name' ) vars.push(obj);

                if ( _.isArray(obj) ) {
                    _.each( obj, function(child, childKey){
                        parseNode(child);
                    });
                }
            })
        }
        console.log(vars)
        return _.uniq(vars);
    }
    $scope.updateVars = function(scope){
        $scope.mathScope[scope.variable] = parseFloat(scope.value);
        console.log('updated vars', $scope.mathScope)
        $scope.result = fn.eval($scope.mathScope)

    }
    $scope.updateGraph = function(scope){
        _.each( $scope.xyData, function(point){
            $scope.mathScope.x = point[0]
            point[1] = fn.eval($scope.mathScope)

        });
        
    }

});

angular.module('ionApp')
.controller('ChemCtrl', function ($scope, $http, $timeout) {
    console.log('ChemCtrl init');
    $scope.molecule = {}
    
    //var sketcherSrc = $('#sketcher-src').contents().find('pre');
    var sketcherHtml = $('<html>')
    var sketcherHead = $('<head>')
    var sketcherBody = $('<body>')

    sketcherHead.append('<meta http-equiv="X-UA-Compatible" content="chrome=1">')
    sketcherHead.append('<script src="scripts/vendor/chemdoodle/ChemDoodleWeb.js"></script>')
    sketcherHead.append('<link rel="stylesheet" href="scripts/vendor/chemdoodle/uis/jquery-ui-10.0.3.custom.css">')
    sketcherHead.append('<script src="scripts/vendor/chemdoodle/uis/ChemDoodleWeb-uis.js"></script>')

    var sketcherCanvas = $('<canvas id="mychemsketcher"></canvas>')
    sketcherBody.append('<div>inside iframe</div>')
    sketcherBody.append(sketcherCanvas)

    sketcherHtml.append(sketcherHead).append(sketcherBody)
    sketcherBody.append('<script src="scripts/chemframe.js"></script>')
         


    var ifrm = document.getElementById('sketcher-frame');
    ifrm = (ifrm.contentWindow) ? ifrm.contentWindow : (ifrm.contentDocument.document) ? ifrm.contentDocument.document : ifrm.contentDocument;
    
    ifrm.document.open();
    ifrm.document.write(sketcherHtml.html());
    ifrm.document.close();




    $scope.updateVars = function(scope){


    }
    $scope.updateGraph = function(scope){

        
    }









});

