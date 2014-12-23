'use strict';

/**
 * @ngdoc filter
 * @name klondikejsApp.filter:rankLetter
 * @function
 * @description
 * # rankLetter
 * Filter in the klondikejsApp.
 */
angular.module('klondikejsApp')
  .filter('rankLetter', function () {
    return function (input) {
      var ranks = ['?', 'A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
      return ranks[input];
    };
  });
