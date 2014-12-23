'use strict';

/**
 * @ngdoc filter
 * @name klondikejsApp.filter:suitName
 * @function
 * @description
 * # suitName
 * Filter in the klondikejsApp.
 */
angular.module('klondikejsApp')
  .filter('suitName', function () {
    return function (input) {
      var suits = ['spades', 'hearts', 'diamonds', 'clubs'];
      return suits[input];
    };
  });
