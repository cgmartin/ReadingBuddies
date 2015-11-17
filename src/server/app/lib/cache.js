'use strict';

var config = require('../config');
var Promise = require('bluebird');
var cacheManager = require('cache-manager');
var redisStore = require('cache-manager-redis');

/**
 * Caching setup (Multi-store)
 *
 * Store in memory and redis backing store.
 * Attempt to first retrieve from memory, then from redis.
 */

var redisCache = cacheManager.caching({
    store: redisStore,
    host: config.redis.host,
    port: config.redis.port,
    db: 0,
    ttl: 86400 // 1 day
});

var memoryCache = cacheManager.caching({
    store: 'memory', max: 100, ttl: 900
});

var multiCache = cacheManager.multiCaching([memoryCache, redisCache]);

//module.exports = Promise.promisifyAll(memoryCache);
module.exports = Promise.promisifyAll(multiCache);
