'use strict';

var app, server,
    express = require('express'),
    http = require('http'),
    path = require('path'),
    winston = require('winston'),
    sockjs_handlers = require(path.join(__dirname, 'lib/sockjs_handlers'));

winston.cli();
winston.emitErrs = false;

// Create an express server and configure it
app = express();
require(path.join(__dirname, 'config/express'))(app);
require(path.join(__dirname, 'config/routes'))(app);

server = http.createServer(app);

// Attach Sockjs handlers to the server
sockjs_handlers.installHandlers(server, { prefix: '/echo' });

// Start the server
server.listen(app.get('port'), function() {
  winston.log('info', 'Express server listening on port %d', app.get('port'));
});
