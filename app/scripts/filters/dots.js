'use strict';

/**
 * @ngdoc filter
 * @name klondikejsApp.filter:dots
 * @function
 * @description
 * # dots
 * Filter in the klondikejsApp.
 */
angular.module('klondikejsApp')
  .filter('dots', function () {
    return function (rank) {
      return {
        0: ["ace"],
        1: ["ace"],
        2: ["spotB1", "spotB5"],
        3: ["spotB1", "spotB3", "spotB5"],
        4: ["spotA1", "spotA5",
        "spotC1", "spotC5"],
        5: ["spotA1", "spotA5",
        "spotB3",
        "spotC1", "spotC5"],
        6: ["spotA1", "spotA3", "spotA5",
        "spotC1", "spotC3", "spotC5"],
        7: ["spotA1", "spotA3", "spotA5",
        "spotB2",
        "spotC1", "spotC3", "spotC5"],
        8: ["spotA1", "spotA3", "spotA5",
        "spotB2", "spotB4",
        "spotC1", "spotC3", "spotC5"],
        9: ["spotA1", "spotA5",
        "spotA2", "spotA4",
        "spotB3",
        "spotC2", "spotC4",
        "spotC1", "spotC5"],
        10: ["spotA1", "spotA5",
        "spotA2", "spotA4",
        "spotB2", "spotB4",
        "spotC2", "spotC4",
        "spotC1", "spotC5"],
        11: ["spotA1", "spotC5"],
        12: ["spotA1", "spotC5"],
        13: ["spotA1", "spotC5"]
      }[rank];
    };
  });
