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
    for (var suit = 0; suit < 4; suit++) {
        for (var rank = 1; rank <= 13; rank++) {
            $scope.stock.push({rank:rank,suit:suit,up:false});
        }
    }

    //  the deck
    for (var i = $scope.stock.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var card = $scope.stock[i];
        $scope.stock[i] = $scope.stock[j];
        $scope.stock[j] = card;
    }

    // Layout the tableau
    for (var a = 0; a < $scope.tableau.length; a++) {
      for (var b = a; b < $scope.tableau.length; b++) {
        var card = $scope.stock.pop();
        $scope.tableau[b].push(card);
        if (a===b) {card.up = true;}
      }
    }

  });
