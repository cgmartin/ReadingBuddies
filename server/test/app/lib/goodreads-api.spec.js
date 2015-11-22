/* jshint -W030 */
'use strict';

var helpers = require('../../helpers.js');
var fs = require('fs');
var Promise = require('bluebird');

describe('Goodreads API', function() {
    var moduleUnderTest = helpers.moduleUnderTest(__filename);
    var module;

    before(function() {
        mockery.enable({
            warnOnUnregistered: false,
            useCleanCache: true
        });
    });
    beforeEach(function() {
        // Load module under test for each test
        mockery.registerAllowable(moduleUnderTest, true);
    });

    afterEach(function() {
        mockery.deregisterAll();
    });
    after(function() {
        mockery.disable();
    });

    describe('getUserInfo', function() {
        it('should GET user info', function(done) {
            var response = JSON.parse(
                fs.readFileSync('server/test/fixtures/requests/goodreads-user-info.json', 'utf8').trim()
            );
            var rpMock = sinon.stub().returns(Promise.resolve(response));
            mockery.registerMock('request-promise', rpMock);
            module = require(moduleUnderTest);

            var api = module({key: 'key', secret: 'secret'});
            api.getUserInfo(1).then(function(data) {
                var calledWith = rpMock.args[0][0];
                expect(calledWith.qs.id).to.eql(1);
                expect(calledWith.qs.key).to.eql('key');
                expect(data.name).to.eql('Test User');
                done();
            });
        });

        it('should GET empty user info', function(done) {
            var rpMock = sinon.stub().returns(Promise.resolve({}));
            mockery.registerMock('request-promise', rpMock);
            module = require(moduleUnderTest);

            var api = module({key: 'key', secret: 'secret'});
            api.getUserInfo(1).then(function(data) {
                expect(data.total).to.eql(0);
                done();
            });
        });
    });

    describe('getUserReviews', function() {
        it('should GET user reviews', function(done) {
            var response = JSON.parse(
                fs.readFileSync('server/test/fixtures/requests/goodreads-user-reviews.json', 'utf8').trim()
            );
            var rpMock = sinon.stub().returns(Promise.resolve(response));
            mockery.registerMock('request-promise', rpMock);
            module = require(moduleUnderTest);

            var api = module({key: 'key', secret: 'secret'});
            api.getUserReviews(1).then(function(data) {
                var calledWith = rpMock.args[0][0];
                expect(calledWith.qs.id).to.eql(1);
                expect(calledWith.qs.key).to.eql('key');
                expect(data.review.length).to.eql(5);
                done();
            });
        });

        it('should GET empty user reviews', function(done) {
            var rpMock = sinon.stub().returns(Promise.resolve({}));
            mockery.registerMock('request-promise', rpMock);
            module = require(moduleUnderTest);

            var api = module({key: 'key', secret: 'secret'});
            api.getUserReviews(1).then(function(data) {
                expect(data.total).to.eql(0);
                done();
            });
        });
    });
});
