'use strict';

describe('Service: Yun', function () {

  // load the service's module
  beforeEach(module('ionApp'));

  // instantiate service
  var Yun;
  beforeEach(inject(function (_Yun_) {
    Yun = _Yun_;
  }));

  it('should do something', function () {
    expect(!!Yun).toBe(true);
  });

});
