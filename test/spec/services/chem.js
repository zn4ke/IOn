'use strict';

describe('Service: chem', function () {

  // load the service's module
  beforeEach(module('ionApp'));

  // instantiate service
  var chem;
  beforeEach(inject(function (_chem_) {
    chem = _chem_;
  }));

  it('should do something', function () {
    expect(!!chem).toBe(true);
  });

});
