'use strict';

angular.module('studiApp')
.factory('Yun', function Yun() {
    var settings = {
        url: "http://192.168.188.29/data/"
    };

    var factoryDefinition = {
        get: function(arg1, arg2){
            var callback = arg2 ? arg2 : arg1;
            var url = settings.url + "get/";
            url += (arg1 && arg2) ? arg1 : ""
            $.ajax({
                url: url,
                dataType: "jsonp",
                jsonp: 'jsonp',
            }).done(function(e) {
                var obj = JSON.parse(e)
                callback(obj);
            });
        },
        set: function(key, value, callback){

            var url = settings.url + "put/" + key + "/" + value;

            $.ajax({
                url: url,
                dataType: "jsonp",
                jsonp: 'jsonp',
            }).done(function(e) {
                callback && callback(e);
            });
        },
        address: function(address){
            if (address){
                settings.url = address;
            }
            else{
                return settings.url;
            }
            console.log('Yun url', settings.url)
        }
    };

    return factoryDefinition;
 });
