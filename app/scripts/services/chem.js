'use strict';

angular.module('ionApp')
.factory('Chem', function () {
    // Service logic
    // ...

    var meaningOfLife = 42;

    // Public API here
    var factoryDefinition = {
        someMethod: function () {
            return meaningOfLife;
        }
    };

    return factoryDefinition
});
