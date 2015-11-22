/// <reference path="../../../typings/tsd.d.ts" />

describe('Home Module', () => {
    let controller: any;
    let $localStorageMock: any;

    beforeEach(angular.mock.module('app'));
    beforeEach(() => {
        $localStorageMock = { readers: [] };
    });
    beforeEach(inject(($controller: angular.IControllerService) => {
        controller = $controller('HomeController', {
            '$localStorage': $localStorageMock
        });
    }));

    describe('HomeController', () => {
        it('should have storage reference', () => {
            chai.expect(controller.storage).to.eql($localStorageMock);
        });
    });
});
