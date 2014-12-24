'use strict';

/**
* @ngdoc function
* @name klondikejsApp.controller:GameCtrl
* @description
* # GameCtrl
* Controller of the klondikejsApp
*/
angular.module('klondikejsApp')
.controller('GameCtrl', function ($scope, $interval, game) {
  $scope.game = game;
  $scope.flipPile = function flipPile(pile) {
    if (pile.length > 0 && !pile[pile.length - 1].up) {
      pile[pile.length - 1].up = true;
    }
  }
});
