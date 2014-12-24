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
  // Set up the deck
  for (var suit = 0; suit < 4; suit++) {
    for (var rank = 1; rank <= 13; rank++) {
      game.stock.push({rank:rank,suit:suit,up:false});
    }
  }

  function shuffle(stack) {
    for (var i = stack.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var card = stack[i];
      stack[i] = stack[j];
      stack[j] = card;
    }
    return stack;
  }

  shuffle(game.stock);

  // Layout the tableau
  for (var a = 0; a < game.tableau.length; a++) {
    for (var b = a; b < game.tableau.length; b++) {
      var card = game.stock.pop();
      game.tableau[b].push(card);
      if (a===b) {card.up = true;}
    }
  }

  $interval(function updateTimer() {
    var now = new Date();
    var diff = now - game.start;
    diff /= 1000;
    var hours = Math.floor(diff/60/60);
    diff -= hours * 60 * 60;
    var minutes = Math.floor(diff/60);
    diff -= minutes * 60;
    var seconds = Math.floor(diff);

    minutes = minutes + '';
    while (minutes.length < 2) { minutes = '0' + minutes; }

    seconds = seconds + '';
    while (seconds.length < 2) { seconds = '0' + seconds; }

    game.time = hours + ':' + minutes + ':' + seconds;
  }, 1000);

  $scope.flipPile = function flipPile(pile) {
    if (pile.length > 0 && !pile[pile.length - 1].up) {
      pile[pile.length - 1].up = true;
    }
  }
});
