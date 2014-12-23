'use strict';

/**
 * @ngdoc function
 * @name klondikejsApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the klondikejsApp
 */
angular.module('klondikejsApp')
  .controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
