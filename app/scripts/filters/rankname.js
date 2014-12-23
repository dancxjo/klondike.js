'use strict';

/**
 * @ngdoc filter
 * @name klondikejsApp.filter:rankName
 * @function
 * @description
 * # rankName
 * Filter in the klondikejsApp.
 */
angular.module('klondikejsApp')
  .filter('rankName', function () {
    return function (input) {
      var ranks = ['joker', 'ace', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'jack', 'queen', 'king'];
      return ranks[input];
    };
  });
