/*jshint node:true, laxcomma:true, expr:true, newcap:false*/
"use strict";

var requirejs = require('requirejs');
requirejs.config({nodeRequire: require});

requirejs(['./app', 'http', './routes', 'socket.io', 'underscore', './functions.json'], function (app, http, routes, socketio, _, fns) {
  var server = http.createServer(app)
    , io = socketio.listen(server, {origins: '*:*', log: false});

  app.get('/', routes.index);


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
    var currentFn = null;
    return _.extend(Object.create(Room), {

      initGame: function(){
        console.log('starting game id ' + roomID);
        currentFn = this.genRandomFn();
        io.sockets.in(roomID).emit('beginGame', currentFn);
      },

     genRandomFn: function(){
        var randProp,
            randIndex,
            keys = [];

        _.each(fns, function(val, prop){
          keys.push(prop);
        });

        randIndex = Math.floor(Math.random() * _.size(keys));
        randProp = keys[randIndex];

        return fns[randProp];
      },

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
      },

      sweetVictory: function(data, socket){
        socket.broadcast.to(roomID).emit('sweetVictory', data);
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

    // Check again if the room is now full, and start a game if it is
    if( currentRoom.isFull() ) {
      currentRoom.initGame();
    }

    // Broadcast changes to a room's users
    socket.on('editorChange', function(data) {
      user.getCurrentRoom().updateEditor(data, socket);
    });

    socket.on('sweetVictory', function(data) {
      user.getCurrentRoom().sweetVictory(data, socket);
    });

    socket.on('disconnect',function(){
      console.log('lol bai');
    });
  });

  server.listen(app.get('port'), function() {
    console.log("Underscoreboard server listening on port " + app.get('port'));
  });
});