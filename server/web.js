/*jshint node:true, newcap:false*/
"use strict";

var requirejs = require('requirejs');
requirejs.config(require("./config"));

requirejs(['app', 'http', './routes', 'sockets'],
  function(app, http, routes, sockets) {
  var server = http.createServer(app),
      io     = sockets(server);

  // Routing table
  app.get('/', routes.index);

  // Start the server
  server.listen(app.get('port'), function() {
    console.log("Express server listening on port " + app.get('port'));
  });

});
