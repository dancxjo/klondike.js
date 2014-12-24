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
        bySuit: '@'
      },
      link: function postLink(scope, element, attrs) {
        var el = element[0];

        function canReceive() {
          var can = false;

          console.log('Testing if can receive');

          if (scope.receptacle.length == 0 && scope.firstRank) {
            console.log('Nothing in receptacle and has firstRank')
            if (game.hand && game.hand[0].rank == scope.firstRank) {
              can = true;
            }
          }

          if (scope.bySuit && scope.receptacle && scope.receptacle.length > 0) {
            if (game.hand && game.hand[0].suit === scope.receptacle[scope.receptacle.length - 1].suit) {
              can = true;
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

              return false;
            }
          },
          false
        );
      }
    };
  }]);
