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
        el.draggable = true;
        el.addEventListener(
          'dragstart',
          function(e) {
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('Text', scope.card);
            console.log(scope.container, scope.index);
            console.dir(scope);
            game.grab(scope.container.length - scope.index, scope.container);
            this.classList.add('drag');
            return false;
          },
          false
        );

        el.addEventListener(
          'dragend',
          function(e) {
            this.classList.remove('drag');
            return false;
          },
          false
        );
      }
    };
  }]);
