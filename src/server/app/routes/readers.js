'use strict';

var express = require('express');
var bodyParser = require('body-parser');
//var errors = require('../lib/errors');
var config = require('../config');
var goodreads = require('../lib/goodreads-api')(config.goodreads);
var cache = require('../lib/cache');

var router = module.exports = new express.Router();

router.use(bodyParser.json());
router.get('/:reader_id/reviews', getReaderReviews);
router.get('/:reader_id', getReaderInfo);

/**
 * Get a reader's latest book reviews
 */
function getReaderReviews(req, res, next) {

    // Pull previous result from cache (if found)
    var readerId = req.params['reader_id'];
    var cacheKey = 'readerReviews_' + readerId;
    cache
        .wrapAsync(cacheKey, function cacheMiss(cacheCb) {
            goodreads
                .getUserReviews(req.params['reader_id'])
                .asCallback(cacheCb);
        })
        .then(function(reviews) {
            res.json(reviews);
        })
        .catch(function(err) {
            return next(err);
        });
}

/**
 * Get a reader's latest book reviews
 */
function getReaderInfo(req, res, next) {

    // Pull previous result from cache (if found)
    var readerId = req.params['reader_id'];
    var cacheKey = 'readerInfo_' + readerId;
    cache
        .wrapAsync(cacheKey, function cacheMiss(cacheCb) {
            goodreads
                .getUserInfo(req.params['reader_id'])
                .asCallback(cacheCb);
        })
        .then(function(userInfo) {
            res.json(userInfo);
        })
        .catch(function(err) {
            return next(err);
        });
}

// TODO: Ensure Terms of Service are met
// https://www.goodreads.com/api/terms
// "Not request any method more than once a second."
// 1. Has request been processed? Yes: send cached result
// 2. Queue request for processing, return HTTP status 202
