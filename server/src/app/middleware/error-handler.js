'use strict';

var path = require('path');

/**
 * Route error handler: send back error status, messaging, and custom pages
 */
module.exports = function createErrorHandler(options) {
    return function(err, req, res, next) {
        if (err.headers) {
            res.set(err.headers);
        }

        var status = err.status || 500;
        res.status(status);

        if (req.xhr) {
            // XHR AJAX API Request
            var response = {
                message: err.message  // Description of error
            };

            // Unique application error code
            response.code = err.code || status;

            // Additional field error messages
            if (err.errors) { response.errors = err.errors; }

            res.json(response);
        } else {
            // Normal browser request
            if (status === 404 && options.custom404Page) {
                res.sendFile(path.resolve(path.join(options.webRootPath, options.custom404Page)));
            } else if (options.customErrorPage) {
                res.sendFile(path.resolve(path.join(options.webRootPath, options.customErrorPage)));
            } else {
                res.send(err.message);
            }
        }
    };
};
