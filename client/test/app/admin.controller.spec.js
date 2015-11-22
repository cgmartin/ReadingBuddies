describe('Admin Module', function() {
    var controller;
    var $localStorageMock;

    beforeEach(module('app'));
    beforeEach(function() {
        $localStorageMock = { readers: [] };
    });
    beforeEach(inject(function($controller) {
        controller = $controller('AdminController', {
            '$localStorage': $localStorageMock
        });
    }));

    describe('AdminController', function() {
        it('should add new reader', function() {
            controller.addReader();
            expect(controller.storage.readers).to.eql([{id: null}]);
        });

        it('should remove reader', function() {
            $localStorageMock.readers.push({id: 1});
            expect(controller.storage.readers).to.eql([{id: 1}]);
            controller.removeReader(0);
            expect(controller.storage.readers).to.eql([]);
        });
    });
});
