/*jshint node:true, laxcomma:true, expr:true, newcap:false*/
"use strict";

var requirejs = require('requirejs');
requirejs.config({nodeRequire: require});

requirejs(['http', 'path', 'express', './routes', 'socket.io', 'underscore', './functions.json'], function (http, path, express, routes, socketio, _, underscoreFns) {
  var app = express()
    , server = http.createServer(app)
    , logging = true
    , io = socketio.listen(server, {origins: '*:*', log: logging});

  app.configure(function() {
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(path.join(__dirname, '../client')));
  });

  app.get('/', routes.index);


  // App-specific logging function. Logs messages only if 'logging' var is set to true.
  var log = function(message) {
    if (logging) { console.log(message); }
  };

  // Room constructor function
  var Room = function(){
    var users = [];
    return _.extend(Object.create(Room), {

      isFull: function(){
        return users.length >= 2;
      },

      addUser: function(user){
        if (this.isFull()) {
          throw new Error("Cannot add users to a full room.");
        }
        return users.push(user);
      },

      getUsers: function(){
        return users;
      }

    });
  };

  // Player factory
  var createUser = function(client){
    return {client: client};
  };


  // Create a room when we initialize the server
  var currentRoom = Room();
  // Create a container to hold full rooms
  var prevRooms = [];

  io.sockets.on('connection', function (client) {
    var user = createUser(client);

    if( currentRoom.isFull() ){
      prevRooms.push(currentRoom);
      currentRoom = Room();
    }

    currentRoom.addUser(user);

    client.on('editorChange', function(message) {
      client.broadcast.emit('updateEditor', message);
    });

    client.on('disconnect',function(){
      console.log('lol bai');
    });
  });

  server.listen(app.get('port'), function() {
    console.log("Underscoreboard server listening on port " + app.get('port'));
  });

});
