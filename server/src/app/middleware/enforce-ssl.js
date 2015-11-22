'use strict';

/**
 * Redirect the user's browser to https
 */
module.exports = function enforceSsl() {
    return function(req, res, next) {
        var isHttps = req.secure;
        if (isHttps) {
            next();
        } else {
            redirectUrl(req, res);
        }
    };
};

function redirectUrl(req, res) {
    if (req.method === 'GET') {
        res.redirect(301, 'https://' + req.headers.host + req.originalUrl);
    } else {
        res.send(403, 'Please use HTTPS when submitting data to this server.');
    }
}
