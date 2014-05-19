'use strict';

angular.module('ionApp')
    .controller('PlayerCtrl', function ($scope, $cookieStore, Db, Template, socket) {
        $scope.data.selected = $scope.data.selected || {};
        $scope.app.showControls = true;
        $scope.eventId = $cookieStore.get('event')
        $scope.app.styles.sidebarWidth = 0;
        $scope.app.player = $scope.app.player || {
            activeSlideNr: 1, 
            zoomFactor: 100, 
            locked: false, 
        };
        $scope.data.answers = $scope.data.answers || [];

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
                    $scope.data.selected.slide = $scope.app.player.event.deck.slides[ $scope.app.player.activeSlideNr ];
                    $scope.app.player.presentation = Template.get.pres[type]
                    $scope.app.player.mobile = Template.get.mobile[type]
                    $scope.app.player.stats = Template.get.stats['bar-chart']

                    if ($scope.app.player.locked) {
                        $scope.app.player.pushSlide();
                    }
                    $scope.app.player.notes = $scope.app.player.event.deck.slides[$scope.app.player.activeSlideNr].notes;
                };
            }
        });


        $scope.app.player.event = Db.event.get( { id: $scope.eventId }, function(event){
            var deck = event.deck;
            var slide = deck.slides[0];
            $scope.data.selected.slide = slide;
            Template.get.pres[slide.type]
            $scope.app.player.notes = slide.notes;
            $scope.app.player.activeSlideNr = 0;
        });

        socket.emit( 'event:join', { id: $scope.eventId } )
        socket.emit( 'event:answers', { id: $scope.eventId } )


        $scope.app.player.pushSlide = function(index){

            var slideNr = index || $scope.app.player.activeSlideNr;
            var slide = $scope.app.player.event.deck.slides[slideNr];

            console.log('pushing slide', slideNr)
            $scope.data.answers.changed = true;
            socket.emit( "event:push", {
                id: $scope.app.player.event._id,
                presentation: Template.get.pres[slide.type],
                mobile: Template.get.mobile[slide.type],
                slideNr: slideNr,
                activeSlide: slide
            });
        };

        socket.on('event:push', function(data){
            $scope.app.player.activeSlideNr = data.slideNr;
            console.log('pushing recieved', data)
        });
        socket.on('event:answer', function(data){
            console.log('answer recieved', data)
            var answers = $scope.data.answers;
            answers[data.slideNr] = answers[data.slideNr] || {}
            if ( answers[data.slideNr][data.own] ) {
                console.log('double submission')
                return;
            }
            else { answers[data.slideNr][data.own] = data.answer }
            $scope.data.answers = answers
            $scope.data.answers.changed = true;
            console.log('event:answer $scope.data.answers', $scope.data.answers)
        });
        socket.on('event:answers', function(data){
            angular.forEach(data.answers, function(answer){
                var ans = $scope.data.answers[answer.slideNr] || {};
                ans[answer.own] = answer.answer;
                $scope.data.answers[answer.slideNr] = ans


            });
            $scope.data.answers.changed = true;
            console.log('$scope.data.answers', $scope.data.answers)
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



angular.module('ionApp')
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
            $scope.data.selected.slide = data.selected.slide;
            $scope.slideNr = data.slideNr;
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

angular.module('ionApp')
    .controller('MobileCtrl', function ($scope, $http, $cookieStore, Template, socket ) {
        $scope.data.selected = $scope.data.selected || {};
        $scope.app.player = $scope.app.player || {
            activeSlideNr: 0, 
            zoomFactor: 100, 
            locked: false 
        };
        $scope.submitted = false;

        $scope.app.showNav = false;
        $scope.app.styles.sidebarWidth = 0;
        $scope.eventId = $cookieStore.get('event')
        socket.emit( 'event:join', { id: $scope.eventId } )

        socket.on('event:push', function(data){
            $scope.submitted = false;
            $scope.templates = {
                mobile: data.mobile,
                presentation: data.presentation
            };
            $scope.data.selected.slide = data.activeSlide;
            $scope.slideNr = data.slideNr;

        });


        $scope.sendAnswer = function(scope){
            if (!$scope.submitted){
                $scope.submitted = true;
                scope.submittedAnswer = true;
            }

            
            $http.post('/submit', {
                    id: $scope.eventId,
                    slideNr: $scope.slideNr,
                    answer: scope.answer.text,
                })
                .success(function(){
                    console.log('success: result posted')
                })
                .error(function(){
                    console.log('error: posting result failed')
                });
            socket.emit('event:answer', {
                id: $scope.eventId,
                slideNr: $scope.slideNr,
                answer: scope.answer.text

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


angular.module('ionApp')
    .controller('StatsCtrl', function ($scope, socket ) {
        console.log('StatsCtrl init')
        $scope.info = 'StatsCtrl'
        $scope.testData = [[[]]];
        socket.emit('event:answers',{})
        var ticks = []
        $scope.testOptions = {
            title: 'myGraph',
            // seriesDefaults: {
            //     renderer: jQuery.jqplot.BarRenderer,
            //     rendererOptions: {
            //       // Put data labels on the pie slices.
            //       // By default, labels show the percentage of the slice.
            //         showDataLabels: true,
            //         dataLabels: 'label',
            //         dataLabelFormatString: "%s", //%.1f%%"
            //         barWidth:25
            //     }
            // },
            // axes:{
            //     xaxis:{renderer:$.jqplot.CategoryAxisRenderer}
            //     //yaxis:{min:-10, max:240}
            // },
            // //legend: { show:true, location: 'e' },
            // series:[{color:'#5FAB78'}]
            //animate: !$.jqplot.use_excanvas,
            seriesDefaults:{
                renderer:$.jqplot.BarRenderer,
                pointLabels: { show: true }
            },
            axes: {
                xaxis: {
                    renderer: $.jqplot.CategoryAxisRenderer,
                    ticks: ticks
                },
                yaxis: {
                    //pad: 1.05,
                    //tickOptions: {formatString: '%d'}
                }
            },
            highlighter: { show: false }
        };
        $scope.$watch('data.answers.changed', function(){
            if( $scope.data.answers.changed ) $scope.updateChart();
            $scope.data.answers.changed = false
            
        });
        $scope.clearChart = function(){

            socket.emit('event:results:clear', {
                id: $scope.app.player.event._id,
                slideNr: $scope.app.player.activeSlideNr
            });
            $scope.data.answers[$scope.app.player.activeSlideNr] = {};
            $scope.updateChart();


        }
        $scope.updateChart = function(){

            var newTestData = [[]];
            var answers = $scope.data.answers[$scope.app.player.activeSlideNr]

            var data = {};
            angular.forEach(answers, function(answer){
                data[answer] = data[answer] 
                    ? data[answer] + 1 
                    : 1;

            });
            $scope.testOptions.axes.xaxis.ticks = [];
            if( $scope.data.selected.slide.mobile ){
                angular.forEach($scope.data.selected.slide.mobile.answers, function(answer, index){
                    $scope.testOptions.axes.xaxis.ticks.push( answer.text )
                });
            }
            angular.forEach($scope.testOptions.axes.xaxis.ticks, function(key){
                //console.log('newTestData[0].length', newTestData[0].length)
                //newTestData[0].push([index, answer])
                
                newTestData[0].push(data[key])
            });

            if (newTestData[0].length == 0){ newTestData = [[[]]] }
            $scope.testData = newTestData;
            //console.log('newTestData[0].length', newTestData[0].length)
            //console.log('testData', JSON.stringify($scope.testData))
        }

    });

