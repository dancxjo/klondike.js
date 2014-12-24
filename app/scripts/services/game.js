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
    return {
      score: 0,
      moves: 0,
      start: new Date(),
      time: '',

      foundations: [[],[],[],[]],
      waste: [],
      stock: [],

      tableau: [[],[],[],[],[],[],[]],

      grab: function grab(number, source) {
        this.source = source;
        this.hand = [];
        for (var i = 0; i < number; i++) {
          var card = this.source[this.source.length - i - 1];//source.pop();
          this.hand.push(card);
        }
      },

      replace: function replace() {
        this.drop(this.source);
        this.hand = undefined;
        this.source = undefined;
      },

      drop: function drop(destination) {
        if (this.source === this.waste && this.tableau.indexOf(destination) > -1) {
          this.score += 5;
        }

        if (this.source === this.waste && this.foundations.indexOf(destination) > -1) {
          this.score += 10;
        }

        if (this.tableau.indexOf(this.source) > -1 && this.foundations.indexOf(destination) > -1) {
          this.score += 10;
        }

        if (this.foundations.indexOf(this.source) > -1 && this.tableau.indexOf(destination) > -1) {
          this.score -= 15;
        }

        while (this.hand && this.hand.length > 0) {
          var card = this.hand.pop();
          if (destination !== this.source) {
            this.source.pop();            
            destination.push(card);
            this.moves++;
          }
        }
      },

      draw: function draw() {
        if (this.stock.length > 0) {
          this.grab(1, this.stock);
          this.hand[0].up = true;
          this.drop(this.waste);
        } else {
          if (this.waste.length > 0) {
            this.score -= 100;
            this.grab(this.waste.length, this.waste);
            for (var i in this.hand) {
              this.hand[i].up = false;
            }
            this.drop(this.stock);
            this.draw();
          }
        }
      }
    }
  });
