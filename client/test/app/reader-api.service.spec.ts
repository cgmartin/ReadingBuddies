/// <reference path="../../../typings/tsd.d.ts" />

describe('Reader Module', () => {
    let service: any;
    let httpBackend: any;

    beforeEach(angular.mock.module('app'));

    describe('readerApi Service', () => {
        beforeEach(inject(($httpBackend: angular.IHttpBackendService, readerApi: any) => {
            httpBackend = $httpBackend;
            service = readerApi;
        }));

        afterEach(() => {
            httpBackend.verifyNoOutstandingExpectation();
            httpBackend.verifyNoOutstandingRequest();
        });

        it('should get reader reviews', () => {
            httpBackend.expectGET('/api/readers/1/reviews').respond({reviews: true});

            let result: any;
            service.getReaderReviews(1).then((response: any) => {
                result = response;
            });

            httpBackend.flush();
            chai.expect(result).to.eql({reviews: true});
        });

        it('should get reader info', () => {
            httpBackend.expectGET('/api/readers/1').respond({readerInfo: true});

            let result: any;
            service.getReaderInfo(1).then((response: any) => {
                result = response;
            });

            httpBackend.flush();
            chai.expect(result).to.eql({readerInfo: true});
        });
    });
});
