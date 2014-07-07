'use strict';
angular.module('ionApp')
.factory('Window', function Menu( $rootScope, $window ) {
    console.log( 'init App-Service' );
    var w = angular.element($window);

    var windowSize = computeWindowSize();
    var settings = {
        sidebarWidth:4,
        navHeight:42,
        controlsHeight:42,
        showNav: true,
        showControls: true,
        showSidebar: false
    }
    var styles = {
        nav: {},
        controls: {},
        quickmenu: {},
        main: {},
        sidebar: {},
        content: {}
    };
    var classes = {
        sidebar: '',
        content: ''
    }

    computeStyles();
    computeClasses();

    // on window resize event: set windowSize
    w.resize( function(){
        windowSize = computeWindowSize();
    });


    function computeWindowSize(){
        return {
            'h': w.height(),
            'w': w.width()
        }
    }

    function computeStyles(){
        styles.nav['height'] = (settings.showNav * settings.navHeight) + 'px';
        styles.controls['height']= (settings.showControls * settings.controlsHeight) + 'px';
        styles.main['top'] = (settings.showNav * settings.navHeight) + 'px';
        styles.main['bottom'] = (settings.showControls * settings.controlsHeight) + 'px';

    }
    function computeClasses(){
        classes.sidebar = settings.showSidebar ? 'col-xs-' + settings.sidebarWidth : '';
        classes.content = settings.showSidebar ? 'col-xs-' + (12 - settings.sidebarWidth) : 'col-xs-12';
    }

    var factoryObject = {
        height: windowSize.h,
        width: windowSize.w,
        settings: settings,
        styles: styles,
        classes: classes,
        get: function( key ){
            return settings[key]
        },
        set: function( key, value ){
            settings[key] = value;
            computeStyles()
            computeClasses()
            return factoryObject;
        },
        showNav: function(){
            settings.showNav = !settings.showNav;
            computeStyles();
        },
        showControls: function(){
            settings.showControls = !settings.showControls;
            computeStyles();
        },
        showSidebar: function(){
            settings.showSidebar = !settings.showSidebar;
            computeStyles();
            computeClasses();
        }
    };

    return factoryObject;
});
