'use strict';

describe('Filter: rankName', function () {

  // load the filter's module
  beforeEach(module('klondikejsApp'));

  // initialize a new instance of the filter before each test
  var rankName;
  beforeEach(inject(function ($filter) {
    rankName = $filter('rankName');
  }));

  it('should return the input prefixed with "rankName filter:"', function () {
    var text = 'angularjs';
    expect(rankName(text)).toBe('rankName filter: ' + text);
  });

});
