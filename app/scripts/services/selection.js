'use strict';
angular.module('ionApp')
.factory('Selection', function Menu() {
    console.log( 'init Selection-Service' );
    var selected = {
        group: {},
        deck: {},
        event: {},
        user: {},
        file: {}
    }

    function selector(type){
        return {
            get: function(){
                return selected[type];
            },
            set: function(obj){
                selected[type] = obj;
            }
        }
    }

    var factoryObject = {
        group: selector('group'),
        deck: selector('deck'),
        event: selector('event'),
        user: selector('user'),
        file: selector('file')
    };

    return factoryObject;
});
