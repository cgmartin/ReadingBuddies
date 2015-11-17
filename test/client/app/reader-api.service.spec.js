describe('Reader Module', function() {
    var service;
    var httpBackend;

    beforeEach(module('app'));

    describe('readerApi Service', function() {
        beforeEach(inject(function($httpBackend, readerApi) {
            httpBackend = $httpBackend;
            service = readerApi;
        }));

        afterEach(function() {
            httpBackend.verifyNoOutstandingExpectation();
            httpBackend.verifyNoOutstandingRequest();
        });

        it('should get reader reviews', function() {
            httpBackend.expectGET('/api/readers/1/reviews').respond({reviews: true});

            var result;
            service.getReaderReviews(1).then(function(response) {
                result = response;
            });

            httpBackend.flush();
            expect(result).to.eql({reviews: true});
        });

        it('should get reader info', function() {
            httpBackend.expectGET('/api/readers/1').respond({readerInfo: true});

            var result;
            service.getReaderInfo(1).then(function(response) {
                result = response;
            });

            httpBackend.flush();
            expect(result).to.eql({readerInfo: true});
        });
    });
});
