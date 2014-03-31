'use strict';

var http = require('http');
var express = require('express');

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var app = express();

require('./config')(app).then(function() {
  var sockjsHandlers = require('./config/sockjs/sockjs_server');
  var server = http.createServer(app);

  sockjsHandlers.installHandlers(server, {
    log: Underscoreboard.log.debug,
    prefix: '/echo'
  });

  server.listen(app.get('port'), function() {
    Underscoreboard.log.info('Express server listening on port %d', app.get('port'));
  });
});
