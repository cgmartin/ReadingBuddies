var errors = require('../lib/errors');
var createDomain = require('domain').create;

/**
 * Unhandled exception domain handler
 *
 * If an unhandled exception occurs during a user's request, ensure a descriptive error
 * is returned and rethrow to the global error handler (for graceful shutdown or other cleanup)
 */
module.exports = function domainMiddleware(req, res, next) {
    var domain = createDomain();
    domain.add(req);
    domain.add(res);
    domain.run(function() {
        next();
    });
    domain.on('error', function(err) {
        if (req.log) { req.log.error(err, 'error'); }
        next(new errors.InternalServerError('Unhandled exception', {cause: err}));
        throw err; // rethrow to global error handler
    });
};

