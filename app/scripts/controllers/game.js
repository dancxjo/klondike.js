'use strict';

/**
 * @ngdoc function
 * @name klondikejsApp.controller:GameCtrl
 * @description
 * # GameCtrl
 * Controller of the klondikejsApp
 */
angular.module('klondikejsApp')
  .controller('GameCtrl', function () {
    this.score = 0;
    this.moves = 32;
    this.start = new Date();
    this.time = 0;

    this.foundations = [[],[],[],[]];
    this.waste = [];
    this.stock = [];

    this.tableau = [[],[],[],[],[],[],[]];

    // Set up the deck
    for (var suit in ['spades', 'hearts', 'diams', 'clubs']) {
        for (var rank = 1; rank <= 13; rank++) {
            this.stock.push({rank:rank,suit:suit,up:false});
        }
    }

    //  the deck
    for (var i = this.stock.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var a = this.stock[i];
        this.stock[i] = this.stock[j];
        this.stock[j] = a;
    }

    // Layout the tableau
    for (var a = 0; a < this.tableau.length; a++) {
      for (var b = a; b < this.tableau.length; b++) {
        var card = this.stock.pop();
        this.tableau[b].push(card);
        if (a===b) card.up = true;
      }
    }

  });
