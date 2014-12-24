'use strict';

/**
 * @ngdoc service
 * @name klondikejsApp.game
 * @description
 * # game
 * Factory in the klondikejsApp.
 */
angular.module('klondikejsApp')
  .factory('game', function () {
    var score = 0;
    var moves = 0;
    var start = new Date();
    var time = '';

    var foundations = [[],[],[],[]];
    var waste = [];
    var stock = [];

    var tableau = [[],[],[],[],[],[],[]];

    // Public API here
    return {
      score: score,
      moves: moves,
      start: start,
      time: time,

      foundations: foundations,
      waste: waste,
      stock: stock,

      tableau: tableau,

      grab: function grab(number, source) {
        this.source = source;
        this.hand = [];
        for (var i = 0; i < number; i++) {
          var card = source.pop();
          this.hand.push(card);
        }
      },

      replace: function replace() {
        this.drop(this.source);
        this.hand = undefined;
        this.src = undefined;
      },

      drop: function drop(destination) {
        if (this.source === waste && tableau.indexOf(destination) > -1) {
          score += 5;
        }

        if (this.source === waste && foundations.indexOf(destination) > -1) {
          score += 10;
        }

        if (tableau.indexOf(this.source) > -1 && foundations.indexOf(destination) > -1) {
          score += 10;
        }

        if (foundations.indexOf(this.source) > -1 && tableau.indexOf(destination) > -1) {
          score -= 15;
        }

        while (this.hand && this.hand.length > 0) {
          var card = this.hand.shift();
          destination.push(card);
          moves++;
        }
      },

      draw: function draw() {
        if (stock.length > 0) {
          this.grab(1, stock);
          this.hand[0].up = true;
          this.drop(waste);
        } else {
          if (waste.length > 0) {
            score -= 100;
            this.grab(waste.length, waste);
            for (var i in this.hand) {
              this.hand[i].up = false;
            }
            this.drop(stock);
            this.draw();
          }
        }
      }
    }
  });
