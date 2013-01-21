/*jshint node:true, laxcomma:true, expr:true, newcap:false*/
"use strict";

var requirejs = require('requirejs');
requirejs.config({nodeRequire: require});

requirejs(['http', 'path', 'express', './routes', 'socket.io', 'underscore', './functions.json'], function (http, path, express, routes, socketio, _, underscoreFns) {
  var app = express()
    , server = http.createServer(app)
    , logging = true
    , io = socketio.listen(server, {origins: '*:*', log: false});

  app.configure(function() {
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.favicon());
    //app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(path.join(__dirname, '../client')));
  });

  // Routing table
  app.get('/', routes.index);


  // App-specific logging function. Logs messages only if 'logging' var is set to true.
  var log = function(message) {
    if (logging) { console.log(message); }
  };

  // ID generator utility function
  var makeID = function(len) {
      var CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      var id = "";

      for (var i = 0, idLen = len || 10; i < idLen; i++) {
        id += CHARSET.charAt(Math.floor(Math.random() * CHARSET.length));
      }

      return id;
  };

  // Room constructor function
  var Room = function(){
    var roomID = makeID(10);
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
        if ( this.isFull() ) { throw new Error("Cannot add users to a full room."); }

        // Subscribe a user to this room's socket broadcasts
        user.getSocket().join(roomID);
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

      getID: function(){
        return roomID;
      },

      // Broadcast the contents of a user's editor to that user's room.
      updateEditor: function(data, socket){
        socket.broadcast.to(roomID).emit('updateEditor', data);
      }

    });
  };

  var User = function(socket){
    // TODO: More robust checking here
    if (!socket) {
      throw new Error("Cannot create a user without linking it to a socket.");
    }

    var userSocket = socket;
    var currentRoom = null;
    var uid = socket.id;
    return {

      setCurrentRoom: function(room){
        return currentRoom = room;
      },

      getCurrentRoom: function(){
        return currentRoom;
      },

      getSocket: function(){
        return userSocket;
      },

      getID: function(){
        return uid;
      }

    };
  };

  // Hash to store our users in
  var Users = {};

  // Create a room when we initialize the server
  var currentRoom = Room();

  io.sockets.on('connection', function (socket) {
    // Check to see if the current room is full and create a new one if it is
    if( currentRoom.isFull() ){
      currentRoom = Room();
    }

    // Create a user and link it to its corresponding socket connection
    var user = User(socket);

    // Add this user to the current room
    currentRoom.addUser(user);

    // Store the room's ID on the user object
    user.setCurrentRoom(currentRoom);

    // Broadcast changes to a room's users
    socket.on('editorChange', function(data) {
      user.getCurrentRoom().updateEditor(data, socket);
    });

    socket.on('disconnect',function(){
      log('lol bai');
    });
  });

  server.listen(app.get('port'), function() {
    log("Underscoreboard server listening on port " + app.get('port'));
  });

});
