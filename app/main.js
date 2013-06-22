/*globals io: true*/

(function() {
  'use strict';

  var requirejs = require('requirejs'),
    path = require('path');

  requirejs.config(require(path.join(__dirname, 'config', 'requirejs')));

  requirejs(['app', 'http', 'routes', 'sockets'], function(app, http, routes, sockets) {
    var server = http.createServer(app),
      io = sockets(server);

    // debugger;
    app.get('/', routes.main);

    // Start the server
    server.listen(app.get('port'), function() {
      console.log('Express server listening on port ' + app.get('port'));
    });
  });
}());
