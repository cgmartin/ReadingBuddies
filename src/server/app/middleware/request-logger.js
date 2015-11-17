'use strict';

var extend = require('util')._extend;
var uuid = require('uuid');

/**
 * Attaches a logger to the request object and logs the request details.
 *
 * Includes a request "Id" to correlate logs within the request
 * and other metadata (request duration, user agent, remote address, etc.).
 *
 * req.log.info('New log message');
 *   ~or~
 * req.log.info({ message: 'New log message', foo: 'bar'});
 *
 * Log levels:
 *   req.log.info()
 *   req.log.warn()
 *   req.log.error()
 *
 * Example output:
 *   { method: 'GET',
 *     url: '/favicon.ico',
 *     httpVersion: '1.1',
 *     statusCode: 200,
 *     contentLength: 1024,
 *     referrer: 'http://localhost:8000/',
 *     userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_1) ...',
 *     remoteAddress: '::1',
 *     duration: 5,
 *     message: 'request',
 *     level: 'info',
 *     reqId: '1f7d79f0-7b82-11e5-833f-df197d43bf7c' }
 */
module.exports = function requestLogger(options) {
    options = options || {};
    options.createLogger = options.createLogger || createLogger;

    return function(req, res, next) {
        var startTime = Date.now();

        // create request logger with request tracking id
        req.log = options.createLogger({
            reqId: uuid.v1()
        });

        res.on('finish', function responseSent() {
            if (req.skipRequestLog) { return; }
            req.log.info(requestMetadata(req, res, startTime));
        });

        next();
    };
};

function createLogger(metadata) {
    var logger = {};
    ['log', 'info', 'error', 'warn'].forEach(function(logType) {
        logger[logType] = function(logMeta) {
            if (logType === 'log') {
                logType = 'info';
            }
            if (typeof logMeta === 'string') {
                logMeta = { message: logMeta };
            }
            logMeta.level = logType;
            logMeta = extend(logMeta, metadata);

            console[logType](JSON.stringify(logMeta));
        };
    });
    return logger;
}

function requestMetadata(req, res, startTime) {
    return {
        method: req.method,
        url: req.originalUrl,
        httpVersion: getHttpVersion(req),
        statusCode: res.statusCode,
        contentLength: res['content-length'],
        referrer: getReferrer(req),
        userAgent: req.headers['user-agent'],
        remoteAddress: getIp(req),
        duration: Date.now() - startTime,
        message: 'request'
    };
}

function getIp(req) {
    return req.ip ||
        req._remoteAddress ||
        (req.connection && req.connection.remoteAddress) ||
        undefined;
}

function getHttpVersion(req) {
    return req.httpVersionMajor + '.' + req.httpVersionMinor;
}

function getReferrer(req) {
    return req.headers.referer || req.headers.referrer;
}
