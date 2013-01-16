/*jshint node:true, laxcomma:true*/
"use strict";

var requirejs = require('requirejs');
requirejs.config({nodeRequire: require});

requirejs(['http', 'path', 'express', './routes', 'socket.io'], function (http, path, express, routes, socketio) {
  var app = express()
    , server = http.createServer(app)
    , io = socketio.listen(server, {origins: '*:*', log: false});

  app.configure(function() {
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));
  });

  app.get('/', routes.index);

  io.configure(function (){
    io.set('authorization', function (handshakeData, cb) {
      cb(null, true);
    });
  });

  io.sockets.on('connection', function (client) {
    client.on('editorChange', function(message) {
      client.broadcast.emit('updateEditor', message);
    });

    client.on('disconnect',function(){
      console.log('Client has disconnected');
    });
  });


  server.listen(app.get('port'), function() {
    console.log("Underscoreboard server listening on port " + app.get('port'));
  });

});
