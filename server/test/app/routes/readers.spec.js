/* jshint -W030 */
'use strict';

var helpers = require('../../helpers.js');
var Promise = require('bluebird');

describe('Routes: Readers', function() {
    var moduleUnderTest = helpers.moduleUnderTest(__filename);
    var router;
    var goodreadsApiMock;
    var apiResponse;
    var cacheMock;

    before(function() {
        mockery.enable({
            warnOnUnregistered: false,
            useCleanCache: true
        });
    });
    beforeEach(function() {
        goodreadsApiMock = {
            getUserReviews: sinon.stub(),
            getUserInfo: sinon.stub()
        };
        cacheMock = {
            wrapAsync: sinon.stub()
        };

        // Marry the api response promise to the cache mock
        apiResponse = Promise.pending();
        cacheMock.wrapAsync.returns(apiResponse.promise);
        cacheMock.wrapAsync.yields(function(err, data) {
            if (err) { return apiResponse.reject(err); }
            apiResponse.resolve(data);
        });

        mockery.registerMock('../config', {});
        mockery.registerMock('../lib/goodreads-api', function() { return goodreadsApiMock; });
        mockery.registerMock('../lib/cache', cacheMock);

        // Load module under test for each test
        mockery.registerAllowable(moduleUnderTest, true);
        router = require(moduleUnderTest);
    });

    afterEach(function() {
        mockery.deregisterAll();
    });
    after(function() {
        mockery.disable();
    });

    describe('getReaderReviews', function() {
        it('should get reviews successfully', function(done) {
            goodreadsApiMock.getUserReviews.returns(Promise.resolve({result: true}));

            var requestMock = {
                url: '/1/reviews', method: 'GET', headers: []
            };
            var responseMock = {
                json: function(reviews) {
                    expect(reviews).to.eql({result: true});
                    expect(cacheMock.wrapAsync.args[0][0]).to.eql('readerReviews_1');
                    done();
                }
            };
            router.handle(requestMock, responseMock, done);
        });

        it('should get failed reviews', function(done) {
            goodreadsApiMock.getUserReviews.returns(Promise.reject(new Error('failed')));

            var requestMock = {
                url: '/2/reviews', method: 'GET', headers: []
            };
            var responseMock = {
                json: sinon.stub().throws('Unexpected call')
            };
            router.handle(requestMock, responseMock, function(err) {
                expect(err.message).to.eql('failed');
                done();
            });
        });
    });

    describe('getReaderInfo', function() {
        it('should get reader info successfully', function(done) {
            goodreadsApiMock.getUserInfo.returns(Promise.resolve({result: true}));

            var requestMock = {
                url: '/1', method: 'GET', headers: []
            };
            var responseMock = {
                json: function(info) {
                    expect(info).to.eql({result: true});
                    expect(cacheMock.wrapAsync.args[0][0]).to.eql('readerInfo_1');
                    done();
                }
            };
            router.handle(requestMock, responseMock, done);
        });

        it('should get failed reader info', function(done) {
            goodreadsApiMock.getUserInfo.returns(Promise.reject(new Error('failed')));

            var requestMock = {
                url: '/2', method: 'GET', headers: []
            };
            var responseMock = {
                json: sinon.stub().throws('Unexpected call')
            };
            router.handle(requestMock, responseMock, function(err) {
                expect(err.message).to.eql('failed');
                done();
            });
        });
    });

});
