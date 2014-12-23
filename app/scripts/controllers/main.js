'use strict';

/**
 * @ngdoc function
 * @name klondikejsApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the klondikejsApp
 */
angular.module('klondikejsApp')
  .controller('MainCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
