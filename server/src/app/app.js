'use strict';

var express = require('express');
var cors = require('cors');
var errors = require('./lib/errors');
var domainErrors = require('./middleware/domain-errors');
var requestLogger = require('./middleware/request-logger');
var helmet = require('helmet');
var enforceSsl = require('./middleware/enforce-ssl');
var compression = require('compression');
var serveStatic = require('serve-static');
var path = require('path');
var catchSpaRoutes = require('./middleware/catch-spa-routes');
var errorHandler = require('./middleware/error-handler');
var config = require('./config');

/**
 * Creates and initializes an Express application
 */
module.exports = function createApp(options) {
    options = options || {};

    var app = express();

    if (config.isBehindProxy) {
        // http://expressjs.com/api.html#trust.proxy.options.table
        app.enable('trust proxy');
    }

    // Unhandled exception domain handler
    app.use(domainErrors);

    // Request logger
    app.use(requestLogger());

    // CORS Requests
    if (config.cors) {
        app.use(cors(config.cors));
    }

    // Security middleware
    app.use(helmet.hidePoweredBy());
    app.use(helmet.ieNoOpen());
    app.use(helmet.noSniff());
    app.use(helmet.frameguard());
    app.use(helmet.xssFilter());
    if (config.isSslEnabled) {
        app.use(helmet.hsts(config.hsts));
        app.use(enforceSsl());
    }

    // Compression settings
    if (config.compression) {
        app.use(compression(config.compression));
    }

    // API routes
    app.use('/api/readers', require('./routes/readers'));

    // Serve static files
    app.use(serveStatic(config.webRootPath, config.staticOptions));

    // SPA deep link routes catch-all
    app.use(catchSpaRoutes(path.join(config.webRootPath, 'index.html')));

    // 404 catch-all
    app.use(function(req, res, next) {
        next(new errors.NotFoundError());
    });

    // Error handler
    app.use(errorHandler(config));

    return app;
};
