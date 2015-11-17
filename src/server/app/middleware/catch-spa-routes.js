'use strict';

var path = require('path');

/**
 * Supports angular's HTML5 mode router and forwards all routes
 * (non-file requests) to a single index file
 */
module.exports = function spaCatchRoutes(indexFilePath) {
    return function(req, res, next) {
        // Bail early if xhr request.
        // jQuery sets this automatically. Angular requires you to manually add the header to $http:
        // $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
        if (req.xhr) { return next(); }

        // Bail early if request is for a file with an extension.
        // If file existed it would have been caught by earlier serveStatic
        if (path.extname(req.url)) { return next(); }

        // Send index for all routes
        res.sendFile(path.resolve(indexFilePath));
    };
};
