'use strict';

angular.module('ionApp')
  .factory('Session', function ($resource) {
    return $resource('/api/session/');
  });
