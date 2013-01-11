/*jshint laxcomma:true, node:true, es5:true */
"use strict";


var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path')
  , io = require('socket.io');

// Create a server and attach socket.io to it
var app = express()
  , server = http.createServer(app)
  , io = io.listen(server, {origins: '*:*', log: false});


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

io.sockets.on('connection', function (socket) {
  socket.on('message', function(message) {
    routes.code(message);
  });
});



server.listen(app.get('port'), function() {
  console.log("Underscoreboard server listening on port " + app.get('port'));
});

