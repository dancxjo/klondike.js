'use strict';

describe('Filter: dots', function () {

  // load the filter's module
  beforeEach(module('klondikejsApp'));

  // initialize a new instance of the filter before each test
  var dots;
  beforeEach(inject(function ($filter) {
    dots = $filter('dots');
  }));

  it('should return the input prefixed with "dots filter:"', function () {
    var text = 'angularjs';
    expect(dots(text)).toBe('dots filter: ' + text);
  });

});
