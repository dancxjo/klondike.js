'use strict';

/**
 * @ngdoc directive
 * @name klondikejsApp.directive:card
 * @description
 * # card
 */
angular.module('klondikejsApp')
  .directive('card', ['game', function (game) {
    return {
      templateUrl: 'views/card.html',
      restrict: 'A',
      scope: {
        card: '=',
        index: '=',
        container: '='
      },
      link: function cardLinker(scope, element, attrs) {
        var el = element[0];

        function dragStart(e) {
          e.dataTransfer.effectAllowed = 'move';
          e.dataTransfer.setData('Text', scope.card);
          console.log(scope.container, scope.index);
          console.dir(scope);
          game.grab(scope.container.length - scope.index, scope.container);
          this.classList.add('drag');
          //scope.$apply(); // This abruptly ends the drag...urgh
          return false;

        }

        function dragEnd(e) {
          if (game.hand.length > 0) {
            game.replace();
            scope.$apply();
          }
          this.classList.remove('drag');
          return false;
        }

        function attachEvents() {
          if (scope.card.up) {
            el.draggable = true;
            el.addEventListener('dragstart', dragStart, false);
            el.addEventListener('dragend', dragEnd, false);
          } else {
            el.draggable = false;
            el.removeEventListener('dragstart', dragStart);
            el.removeEventListener('dragend', dragEnd);
          }
        }

        attachEvents();
        scope.$watch('card.up', attachEvents);

      }
    };
  }]);
