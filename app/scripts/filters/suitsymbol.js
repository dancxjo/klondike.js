'use strict';

/**
 * @ngdoc filter
 * @name klondikejsApp.filter:suitSymbol
 * @function
 * @description
 * # suitSymbol
 * Filter in the klondikejsApp.
 */
angular.module('klondikejsApp')
  .filter('suitSymbol', function () {
    return function (input) {
      var suits = ['♠',	'♥',	'♦',	'♣'];
      return suits[input];
    };
  });
