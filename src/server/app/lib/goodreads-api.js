'use strict';

var rp = require('request-promise');
var xml2js = require('xml2js');
var Promise = require('bluebird');

// Enable request debugging
if (process.env['DEBUG_REQUEST'] === '1') {
    require('request-debug')(rp);
}

var GOODREADS_BASEURL = 'https://www.goodreads.com';

module.exports = function goodreadsApiFactory(options) {
    return new GoodreadsApi(options);
};

function GoodreadsApi(options) {
    this.options = options || {};
}

GoodreadsApi.prototype.getUserReviews = function(userId) {
    return rp({
        uri: GOODREADS_BASEURL + '/review/list.xml',
        qs: {
            v: '2',
            id: userId, // '2040005-wil-wheaton'
            shelf: 'read',
            sort: 'date_updated',
            page: '1',
            'per_page': '5',
            key: this.options.key
        },
        transform: parseXmlResponse
    }).then(function processResponse(data) {
        if (data.GoodreadsResponse && data.GoodreadsResponse.reviews) {
            return data.GoodreadsResponse.reviews;
        } else {
            return {total: 0};
        }
    });
};

GoodreadsApi.prototype.getUserInfo = function(userId) {
    return rp({
        uri: GOODREADS_BASEURL + '/user/show.xml',
        qs: {
            id: userId, // '2040005-wil-wheaton'
            key: this.options.key
        },
        transform: parseXmlResponse
    }).then(function processResponse(data) {
        if (data.GoodreadsResponse && data.GoodreadsResponse.user) {
            return data.GoodreadsResponse.user;
        } else {
            return {total: 0};
        }
    });
};

function parseXmlResponse(body) {
    console.log('FOO:', body);
    return new Promise(function(resolve, reject) {
        var parser = new xml2js.Parser({
            // These settings are specific to the Goodreads XML format,
            // and help transform to JSON a bit more cleanly
            mergeAttrs: true,
            explicitArray: false,
            valueProcessors: [xml2js.processors.parseNumbers]
        });
        parser.parseString(body, function (err, result) {
            if (err) { return reject(err); }
            resolve(result);
        });
    });
}
