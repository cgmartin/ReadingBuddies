/// <reference path="../../../typings/tsd.d.ts" />
describe('Admin Module', function () {
    var controller;
    var $localStorageMock;
    beforeEach(angular.mock.module('app'));
    beforeEach(function () {
        $localStorageMock = { readers: [] };
    });
    beforeEach(inject(function ($controller) {
        controller = $controller('AdminController', {
            '$localStorage': $localStorageMock
        });
    }));
    describe('AdminController', function () {
        it('should add new reader', function () {
            controller.addReader();
            chai.expect(controller.storage.readers).to.eql([{ id: null }]);
        });
        it('should remove reader', function () {
            $localStorageMock.readers.push({ id: 1 });
            chai.expect(controller.storage.readers).to.eql([{ id: 1 }]);
            controller.removeReader(0);
            chai.expect(controller.storage.readers).to.eql([]);
        });
    });
});
