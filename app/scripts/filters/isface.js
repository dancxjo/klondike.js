'use strict';

/**
 * @ngdoc filter
 * @name klondikejsApp.filter:isFace
 * @function
 * @description
 * # isFace
 * Filter in the klondikejsApp.
 */
angular.module('klondikejsApp')
  .filter('isFace', function () {
    return function (input) {
      return input > 10;
    };
  });
