'use strict';

describe('Filter: rankLetter', function () {

  // load the filter's module
  beforeEach(module('klondikejsApp'));

  // initialize a new instance of the filter before each test
  var rankLetter;
  beforeEach(inject(function ($filter) {
    rankLetter = $filter('rankLetter');
  }));

  it('should return the input prefixed with "rankLetter filter:"', function () {
    var text = 'angularjs';
    expect(rankLetter(text)).toBe('rankLetter filter: ' + text);
  });

});
