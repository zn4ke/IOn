'use strict';

angular.module('studiApp')
  .factory('Session', function ($resource) {
    return $resource('/api/session/');
  });
