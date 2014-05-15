'use strict';

describe('Directive: chem', function () {

  // load the directive's module
  beforeEach(module('studiApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<chem></chem>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the chem directive');
  }));
});