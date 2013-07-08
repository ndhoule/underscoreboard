(function() {
  'use strict';

  var requirejs = require('requirejs'),
      path = require('path'),
      winston = require('winston');

  winston.cli();
  winston.emitErrs = false;

  requirejs.config(require(path.join(__dirname, 'config', 'requirejs')));

  requirejs(['app', 'http', 'routes', 'sockjs_handlers'], function(app, http, routes, sockjs_handlers) {
    var server = http.createServer(app);

    // Attach Sockjs handlers to the server
    sockjs_handlers.installHandlers(server, { prefix: '/echo' });

    // debugger;
    app.get('/', routes.main);

    // Start the server
    server.listen(app.get('port'), function() {
      winston.log('info', 'Express server listening on port %d', app.get('port'));
    });
  });
}).call(this);
