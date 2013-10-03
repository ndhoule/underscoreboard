'use strict';

var http = require('http');
var express = require('express');
var sockjsHandlers = require('./config/sockjs/sockjs_server');

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var app = express();
var server = http.createServer(app);

require('./config')(app);

sockjsHandlers.installHandlers(server, {
  log: Underscoreboard.log.debug,
  prefix: '/echo'
});

server.listen(app.get('port'), function() {
  Underscoreboard.log.info('Express server listening on port %d', app.get('port'));
});
