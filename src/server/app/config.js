'use strict';

module.exports = {
    // Running in production mode
    isProduction: (process.env['NODE_ENV'] === 'production'),

    // Port that the express server should run on
    port: parseInt(process.env['API_PORT'] || process.env['PORT'] || 8000),

    // The www root path that the static middleware should serve
    webRootPath: process.env['STATIC_WEBROOT'] || './build/client',

    // Static middleware options
    // see: https://github.com/expressjs/serve-static#options
    staticOptions: {
        index:  false,  // Fall through to SPA catch-all for index.html
        maxAge: 0       // far-future cache control
    },

    // Enable this if behind a secure reverse proxy, like Heroku, CloudFlare, etc.
    isBehindProxy: (process.env['API_REV_PROXY'] === '1' || process.env['API_REV_PROXY'] === 'true'),

    // Enable for HTTPS
    isSslEnabled: (process.env['API_SSL'] === '1' || process.env['API_SSL'] === 'true'),

    // HTTPS key/cert file paths
    sslKeyFile: process.env['API_SSL_KEY'],
    sslCertFile: process.env['API_SSL_CERT'],

    // Gzip compression options
    // See https://github.com/expressjs/compression#options
    compression: {
        threshold: 4000
    },

    // HTTP Strict Transport Security options
    // see: https://github.com/helmetjs/hsts
    hsts: {
        maxAge: 7776000000, // ninety days in ms
        includeSubdomains: true,
        preload: true
    },

    // Limits maximum incoming headers count. If set to 0 - no limit will be applied.
    maxHeadersCount: 1000,

    // The number of milliseconds of inactivity before a socket is presumed to have timed out.
    serverTimeout: 2 * 60 * 1000, // 2 minutes

    // Cross-site HTTP requests
    // https://github.com/expressjs/cors#configuring-cors
    cors: false,

    // On 404 errors, send a custom page. File is relative to webRootPath.
    custom404Page: false, // '404.html'

    // On all other errors, send a custom page. File is relative to webRootPath.
    customErrorPage: false, // '500.html'

    // GoodReads API secrets
    goodreads: {
        key: process.env['GOODREADS_API_KEY'],
        secret: process.env['GOODREADS_API_SECRET']
    },

    // Redis backing store
    redis: {
        host: process.env['REDIS_HOST'] || 'localhost',
        port: parseInt(process.env['REDIS_PORT'] || 6379)
    }
};
