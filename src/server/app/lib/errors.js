'use strict';

var assert = require('assert');
var http = require('http');
var util = require('util');

var errors = module.exports;

/**
 * All HTTP Errors will extend from this object
 */
function HttpError(message, options) {
    // handle constructor call without 'new'
    if (!(this instanceof HttpError)) {
        return new HttpError(message, options);
    }

    HttpError.super_.call(this);
    Error.captureStackTrace(this, this.constructor);
    this.name = 'HttpError';
    this.message = message;
    this.status = 500;

    options = options || {};
    if (options.code)     { this.code = options.code; }
    if (options.errors)   { this.errors = options.errors; }
    if (options.headers)  { this.headers = options.headers; }
    if (options.cause)    { this.cause = options.cause; }
}
util.inherits(HttpError, Error);

/**
 * Helper method to add a WWW-Authenticate header
 * https://tools.ietf.org/html/rfc6750#section-3
 */
HttpError.prototype.authBearerHeader = function(realm, error, description) {
    if (!this.headers) {
        this.headers = {};
    }
    realm = realm || 'Secure Area';
    var authHeader = 'Bearer realm="' + realm + '"';
    if (error) {
        authHeader += ',error="' + error + '"';
    }
    if (description) {
        authHeader += ',error_description="' + description + '"';
    }
    this.headers['WWW-Authenticate'] = authHeader;

    return this;
};

/**
 * Creates a custom API Error sub type
 */
HttpError.extend = function(subTypeName, statusCode, defaultMessage) {
    assert(subTypeName, 'subTypeName is required');

    var SubTypeError = function(message, options) {
        // handle constructor call without 'new'
        if (!(this instanceof SubTypeError)) {
            return new SubTypeError(message, options);
        }

        SubTypeError.super_.call(this, message, options);
        Error.captureStackTrace(this, this.constructor);

        this.name = subTypeName;
        this.status = parseInt(statusCode || 500, 10);
        this.message = message || defaultMessage;
    };

    // Inherit the parent's prototype chain
    util.inherits(SubTypeError, this);
    SubTypeError.extend = this.extend;

    return SubTypeError;
};

errors.HttpError = HttpError;

// Create an error type for each of the 400/500 status codes
var httpCodes = Object.keys(http.STATUS_CODES);
httpCodes.forEach(function(statusCode) {
    if (statusCode < 400) { return; }

    var name = getErrorNameFromStatusCode(statusCode);
    errors[name] = HttpError.extend(name, statusCode, http.STATUS_CODES[statusCode]);
});

/**
 * Convert status description to error name
 */
function getErrorNameFromStatusCode(statusCode) {
    statusCode = parseInt(statusCode, 10);
    var status = http.STATUS_CODES[statusCode];
    if (!status) { return false; }

    var name = '';
    var words = status.split(/\s+/);
    words.forEach(function(w) {
        name += w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
    });

    name = name.replace(/\W+/g, '');

    if (!/\w+Error$/.test(name)) {
        name += 'Error';
    }
    return name;
}

// For reference:
//var http.STATUS_CODES = {
//    '400': 'Bad Request',
//    '401': 'Unauthorized',
//    '402': 'Payment Required',
//    '403': 'Forbidden',
//    '404': 'Not Found',
//    '405': 'Method Not Allowed',
//    '406': 'Not Acceptable',
//    '407': 'Proxy Authentication Required',
//    '408': 'Request Time-out',
//    '409': 'Conflict',
//    '410': 'Gone',
//    '411': 'Length Required',
//    '412': 'Precondition Failed',
//    '413': 'Request Entity Too Large',
//    '414': 'Request-URI Too Large',
//    '415': 'Unsupported Media Type',
//    '416': 'Requested Range Not Satisfiable',
//    '417': 'Expectation Failed',
//    '418': 'I\'m a teapot',
//    '422': 'Unprocessable Entity',
//    '423': 'Locked',
//    '424': 'Failed Dependency',
//    '425': 'Unordered Collection',
//    '426': 'Upgrade Required',
//    '428': 'Precondition Required',
//    '429': 'Too Many Requests',
//    '431': 'Request Header Fields Too Large',
//    '500': 'Internal Server Error',
//    '501': 'Not Implemented',
//    '502': 'Bad Gateway',
//    '503': 'Service Unavailable',
//    '504': 'Gateway Time-out',
//    '505': 'HTTP Version Not Supported',
//    '506': 'Variant Also Negotiates',
//    '507': 'Insufficient Storage',
//    '509': 'Bandwidth Limit Exceeded',
//    '510': 'Not Extended',
//    '511': 'Network Authentication Required'
//};
