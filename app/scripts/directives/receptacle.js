'use strict';

/**
 * @ngdoc directive
 * @name klondikejsApp.directive:receptacle
 * @description
 * # receptacle
 */
angular.module('klondikejsApp')
  .directive('receptacle', ['game', function (game) {
    return {
      restrict: 'A',
      scope: {
        receptacle: '=',
        firstRank: '@',
        nextBy: '@',
        direction: '@'
      },
      link: function postLink(scope, element, attrs) {
        var el = element[0];

        function canReceive() {
          var can = false;

          if (scope.receptacle.length == 0 && scope.firstRank) {
            console.log('Nothing in receptacle and has firstRank');
            console.log(game.hand);
            if (game.hand && game.hand[game.hand.length-1].rank == scope.firstRank) {
              can = true;
            }
          }

          if (scope.nextBy === 'suit' && scope.receptacle && scope.receptacle.length > 0) {
            if (game.hand && game.hand[game.hand.length-1].suit === scope.receptacle[scope.receptacle.length - 1].suit) {
              can = true;
            }
          }
          console.log(scope);
          if (scope.nextBy === 'alternating-colors' && scope.receptacle.length > 0) {
            if (game.hand) {
              var colors = ['black', 'red', 'red', 'black'];
              if (colors[game.hand[game.hand.length-1].suit] !== colors[scope.receptacle[scope.receptacle.length - 1].suit]) {
                can = true;
              }
            }
          }

          if (can && scope.receptacle.length > 0) {
            var inc = 1;
            if (scope.direction === 'desc') {
              inc *= -1;
            }
            if (game.hand && game.hand[game.hand.length-1].rank === scope.receptacle[scope.receptacle.length - 1].rank + inc) {
              can = true;
            } else {
              can = false;
            }
          }

          return can;
        };

        el.addEventListener(
          'dragover',
          function(e) {
            if (canReceive()) {
              e.dataTransfer.dropEffect = 'move';
              // allows us to drop
              if (e.preventDefault) e.preventDefault();
              this.classList.add('over');
              return false;
            }
          },
          false
        );

        el.addEventListener(
          'dragenter',
          function(e) {
            if (canReceive()) {
              this.classList.add('over');
              return false;
            }
          },
          false
        );

        el.addEventListener(
          'dragleave',
          function(e) {
            if (canReceive()) {
              this.classList.remove('over');
              return false;
            }
          },
          false
        );

        el.addEventListener(
          'drop',
          function(e) {
            if (canReceive()) {
              // Stops some browsers from redirecting.
              if (e.stopPropagation) e.stopPropagation();

              this.classList.remove('over');

              //var item = document.getElementById(e.dataTransfer.getData('Text'));
              //this.appendChild(item);

              game.drop(scope.receptacle);
              scope.$apply();
              return false;
            }
          },
          false
        );
      }
    };
  }]);
