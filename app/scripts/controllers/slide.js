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
    console.log('init MathCtrl')
    var math = mathjs();



    $scope.chartData = [
        {
               "key": "Series 1",
                "values": []
        }
    ];

    for(var i = -2; i < 2 ; i += 0.01){
        $scope.chartData[0].values.push([i,i])
    }

    $scope.toolTipContentFunction = function(){

        return function(key, x, y, e, graph) {

            return  '<p>{ ' +  y + ' , ' + x + ' }</p>'
        }
    }
    $scope.xAxisFormatFun = function(){
        return function(d){
            return d3.format('.2g')(d);
        }
    }
    $scope.yAxisFormatFun = function(){
        return function(d){
            return d3.format('.2g')(d);
        }
    }



    $scope.parseMath = function(formula){

        var tree = math.parse(formula);
        var fn = tree.compile(math);
        var scope = parseVars(tree.expr)

        $scope.myMath = {
            tree: tree,
            fn: fn,
            scope: scope,
        };
    }



    $scope.mathInput = "a*x^2+b*x+c+test";

    $scope.parseMath( $scope.mathInput )




    function parseVars(tree){
        var mathScope = {};
        parseNode(tree);
        // recursive function to walk node tree
        function parseNode(node){
            _.each(node, function(obj, key){
                if ( key === 'name' ) {
                    mathScope[obj] = 0
                }
                if ( _.isArray(obj) ) {
                    _.each( obj, function(child, childKey){
                        parseNode(child);
                    });
                }
            })
        }
        return mathScope
    }

    $scope.updateMathScope = function(scope){
        $scope.myMath.scope[scope.key] = parseFloat(scope.obj);

        $scope.updateGraph()
    }
    $scope.updateGraph = function(){
        _.each( $scope.chartData[0].values, function(point){
            $scope.myMath.scope.x = point[0]
            point[1] = $scope.myMath.fn.eval($scope.myMath.scope)
        });
        delete $scope.myMath.scope.x;
        delete $scope.myMath.scope.ans;
    }

});




angular.module('ionApp')
.controller('ChemCtrl', function ($scope, $http, $timeout) {
    console.log('ChemCtrl init');
    $scope.molecule = {}

    var viewer = new ChemDoodle.ViewerCanvas('viewer-canvas', 200, 200);


    $scope.updateMol = function(){
        console.log('commiting mol')
        var sktch = window.frames[0].window.sketcher;
        console.log(sktch)
        var mol = sktch.getMolecule();
        console.log(mol)
        $scope.molFile = ChemDoodle.writeMOL(mol);
        console.log($scope.molFile)

        // get the dimension of the molecule
        var size = mol.getDimension();
        console.log('size',size)
        // find the scale by taking the minimum of the canvas/size ratios
        var scale = Math.min(viewer.width/size.x, viewer.height/size.y);
        console.log('scale',scale)
        // load the molecule first (this function automatically sets scale, so we need to change specs after)
        viewer.loadMolecule( ChemDoodle.readMOL($scope.molFile) );
        // change the specs.scale value to the scale calculated, shrinking it slightly so that text is not cut off
        viewer.specs.scale = scale*.85;
        // repaint the canvas
        viewer.repaint(); 

    }

});

