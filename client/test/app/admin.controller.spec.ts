/// <reference path="../../../typings/tsd.d.ts" />

describe('Admin Module', () => {
    let controller: any;
    let $localStorageMock: any;

    beforeEach(angular.mock.module('app'));
    beforeEach(() => {
        $localStorageMock = { readers: [] };
    });
    beforeEach(inject(($controller: angular.IControllerService) => {
        controller = $controller('AdminController', {
            '$localStorage': $localStorageMock
        });
    }));

    describe('AdminController', () => {
        it('should add new reader', () => {
            controller.addReader();
            chai.expect(controller.storage.readers).to.eql([{id: null}]);
        });

        it('should remove reader', () => {
            $localStorageMock.readers.push({id: 1});
            chai.expect(controller.storage.readers).to.eql([{id: 1}]);
            controller.removeReader(0);
            chai.expect(controller.storage.readers).to.eql([]);
        });
    });
});
