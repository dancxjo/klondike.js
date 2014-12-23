'use strict';

describe('Filter: suitSymbol', function () {

  // load the filter's module
  beforeEach(module('klondikejsApp'));

  // initialize a new instance of the filter before each test
  var suitSymbol;
  beforeEach(inject(function ($filter) {
    suitSymbol = $filter('suitSymbol');
  }));

  it('should return the input prefixed with "suitSymbol filter:"', function () {
    var text = 'angularjs';
    expect(suitSymbol(text)).toBe('suitSymbol filter: ' + text);
  });

});
