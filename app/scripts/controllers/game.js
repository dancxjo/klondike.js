'use strict';

/**
* @ngdoc function
* @name klondikejsApp.controller:GameCtrl
* @description
* # GameCtrl
* Controller of the klondikejsApp
*/
angular.module('klondikejsApp')
.controller('GameCtrl', function ($scope, $interval) {
  $scope.score = 0;
  $scope.moves = 0;
  $scope.start = new Date();
  $scope.time = '';

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

  function shuffle(stack) {
    for (var i = stack.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var card = stack[i];
      stack[i] = stack[j];
      stack[j] = card;
    }
    return stack;
  }

  shuffle($scope.stock);

  // Layout the tableau
  for (var a = 0; a < $scope.tableau.length; a++) {
    for (var b = a; b < $scope.tableau.length; b++) {
      var card = $scope.stock.pop();
      $scope.tableau[b].push(card);
      if (a===b) {card.up = true;}
    }
  }

  $scope.hand = undefined;
  $scope.source = undefined;

  $scope.grab = function grab(number, source) {
    $scope.source = source;
    $scope.hand = [];
    for (var i = 0; i < number; i++) {
      var card = source.pop();
      $scope.hand.push(card);
    }
  };

  $scope.replace = function replace() {
    $scope.drop($scope.source);
    $scope.hand = undefined;
    $scope.source = undefined;
  };

  $scope.drop = function drop(destination) {
    if ($scope.source === $scope.waste && $scope.tableau.indexOf(destination) > -1) {
      $scope.score += 5;
    }

    if ($scope.source === $scope.waste && $scope.foundations.indexOf(destination) > -1) {
      $scope.score += 10;
    }

    if ($scope.tableau.indexOf($scope.source) > -1 && $scope.foundations.indexOf(destination) > -1) {
      $scope.score += 10;
    }

    if ($scope.foundations.indexOf($scope.source) > -1 && $scope.tableau.indexOf(destination) > -1) {
      $scope.score -= 15;
    }


    while ($scope.hand && $scope.hand.length > 0) {
      var card = $scope.hand.shift();
      destination.push(card);
      $scope.moves++;
    }
  };

  $scope.draw = function draw() {
    if ($scope.stock.length > 0) {
      $scope.grab(1, $scope.stock);
      $scope.hand[0].up = true;
      $scope.drop($scope.waste);
    } else {
      if ($scope.waste.length > 0) {
        $scope.score -= 100;
        $scope.grab($scope.waste.length, $scope.waste);
        for (var i in $scope.hand) {
          $scope.hand[i].up = false;
        }
        $scope.drop($scope.stock);
        $scope.draw();
      }
    }
  }

  $interval(function updateTimer() {
    var now = new Date();
    var diff = now - $scope.start;
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

    $scope.time = hours + ':' + minutes + ':' + seconds;
  }, 1000);
});
