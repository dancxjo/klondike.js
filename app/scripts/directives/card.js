'use strict';

/**
 * @ngdoc directive
 * @name klondikejsApp.directive:card
 * @description
 * # card
 */
angular.module('klondikejsApp')
  .directive('card', function () {
    return {
      templateUrl: 'views/card.html',
      restrict: 'EAC',
      scope: {
        face: '@',
        rank: '@',
        suit: '@'
      }
    };
  });
