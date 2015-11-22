/// <reference path="../../../typings/tsd.d.ts" />
describe('Home Module', function () {
    var controller;
    var $localStorageMock;
    beforeEach(angular.mock.module('app'));
    beforeEach(function () {
        $localStorageMock = { readers: [] };
    });
    beforeEach(inject(function ($controller) {
        controller = $controller('HomeController', {
            '$localStorage': $localStorageMock
        });
    }));
    describe('HomeController', function () {
        it('should have storage reference', function () {
            chai.expect(controller.storage).to.eql($localStorageMock);
        });
    });
});
