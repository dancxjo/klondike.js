'use strict';

/**
 * @ngdoc function
 * @name klondikejsApp.controller:GameCtrl
 * @description
 * # GameCtrl
 * Controller of the klondikejsApp
 */
angular.module('klondikejsApp')
  .controller('GameCtrl', function ($scope) {
    $scope.score = 0;
    $scope.moves = 32;
    $scope.start = new Date();
    $scope.time = 0;

    $scope.foundations = [[],[],[],[]];
    $scope.waste = [];
    $scope.stock = [];

    $scope.tableau = [[],[],[],[],[],[],[]];

    // Set up the deck
    for (var suit in ['spades', 'hearts', 'diams', 'clubs']) {
        for (var rank = 1; rank <= 13; rank++) {
            $scope.stock.push({rank:rank,suit:suit,up:false});
        }
    }
  });
