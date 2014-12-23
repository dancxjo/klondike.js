'use strict';

describe('Filter: isFace', function () {

  // load the filter's module
  beforeEach(module('klondikejsApp'));

  // initialize a new instance of the filter before each test
  var isFace;
  beforeEach(inject(function ($filter) {
    isFace = $filter('isFace');
  }));

  it('should return the input prefixed with "isFace filter:"', function () {
    var text = 'angularjs';
    expect(isFace(text)).toBe('isFace filter: ' + text);
  });

});
