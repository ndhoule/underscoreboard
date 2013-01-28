/*jshint node:true, laxcomma:true, expr:true, newcap:false*/
"use strict";

var requirejs = require('requirejs');
requirejs.config({nodeRequire: require});

requirejs(['./app', 'http', './routes', './RoomModel', './UserModel', 'socket.io'], function(app, http, routes, Room, User, socketio){
  var server = http.createServer(app)
    , io = socketio.listen(server, {origins: '*:*', log: false});

  // Routing table
  app.get('/', routes.index);


  // Hash to store our users in
  var Users = {};

  // Create a room when we initialize the server
  var currentRoom = Room(io);

  io.sockets.on('connection', function(socket){
    // Check to see if the current room is full and create a new one if it is
    if( currentRoom.isFull() ){
      currentRoom = Room(io);
    }

    // Create a user and link it to its corresponding socket connection
    var user = User(socket);

    // Add this user to the current room
    currentRoom.addUser(user);

    // Store the room's ID on the user object
    user.setCurrentRoom(currentRoom);

    // Check again if the room is now full, and start a game if it is
    if( currentRoom.isFull() ){
      currentRoom.initGame();
    }

    // Broadcast changes to a room's users
    socket.on('editorChange', function(data){
      user.getCurrentRoom().updateEditor(data, socket);
    });

    socket.on('sweetVictory', function(data){
      user.getCurrentRoom().sweetVictory(data, socket);
    });

    socket.on('disconnect',function(){
      console.log('lol bai');
    });
  });

  server.listen(app.get('port'), function(){
    console.log("Underscoreboard server listening on port " + app.get('port'));
  });
});
