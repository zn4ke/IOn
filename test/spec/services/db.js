'use strict';

describe('Service: Db', function () {

  // load the service's module
  beforeEach(module('ionApp'));

  // instantiate service
  var Db;
  beforeEach(inject(function (_Db_) {
    Db = _Db_;
  }));

  it('should do something', function () {
    expect(!!Db).toBe(true);
  });

});
