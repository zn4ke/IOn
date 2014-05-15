'use strict';

angular.module('studiApp')
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
