'use strict';

// Load optional .env file with environment vars (first thing!)
require('dotenv').config({silent: true});

var config = require('./config');
var app = require('./app')();
var fs = require('fs');
var https = require('https');
var http = require('http');

// Create a secure or insecure server
var server;
if (!config.isBehindProxy && config.isSslEnabled) {
    var sslOptions = {
        key:  fs.readFileSync(config.sslKeyFile),
        cert: fs.readFileSync(config.sslCertFile)
    };
    server = https.createServer(sslOptions, app); // Secure https server
} else {
    server = http.createServer(app);              // Insecure http server
}

// Tune server settings
server.maxHeadersCount = config.maxHeadersCount;
server.timeout = config.serverTimeout;

// Start the server on port
server.listen(config.port, function listenCb() {
    var host = server.address().address;
    var port = server.address().port;
    var scheme = (server instanceof https.Server) ? 'https' : 'http';
    console.info('api server listening at %s://%s:%s', scheme, host, port);
});

