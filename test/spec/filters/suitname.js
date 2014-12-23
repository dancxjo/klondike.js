'use strict';

describe('Filter: suitName', function () {

  // load the filter's module
  beforeEach(module('klondikejsApp'));

  // initialize a new instance of the filter before each test
  var suitName;
  beforeEach(inject(function ($filter) {
    suitName = $filter('suitName');
  }));

  it('should return the input prefixed with "suitName filter:"', function () {
    var text = 'angularjs';
    expect(suitName(text)).toBe('suitName filter: ' + text);
  });

});
