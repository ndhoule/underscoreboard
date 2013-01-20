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

  // ID generator utility function
  var makeId = function(len) {
      var id, CHARSET;
      CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      id = "";

      for (var i = 0, idLen = len || 10; i < idLen; i++) {
          id += CHARSET.charAt(Math.floor(Math.random() * CHARSET.length));
      }

      return id;
  };

  // Room constructor function
  var Room = function(){
    var roomId = makeId(25);
    var users = [];
    return _.extend(Object.create(Room), {

      // Checks if the room is full. Returns true if yes, false if no.
      isFull: function(){
        return users.length >= 2;
      },

      // Adds a user to the room's users array and subscribes them to this
      // room's broadcasts.
      addUser: function(user){
        // TODO: Fix this security hole--isFull could be redefined by user
        if (this.isFull()) { throw new Error("Cannot add users to a full room."); }

        io.sockets.join(roomId);
        return users.push(user);
      },

      // Remove a user from the current room.
      removeUser: function(user){
        //TODO: Implement garbage collection on rooms
      },

      // Return an array containing all users in the room.
      getUsers: function(){
        return users;
      },

      // Emit the contents of a user's editor.
      sendUpdate: function(){
        //TODO: Move editor update emit logic here
      }

    });
  };

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
