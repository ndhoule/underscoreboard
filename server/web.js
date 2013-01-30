/*jshint node:true, newcap:false*/
"use strict";

var requirejs = require('requirejs');
requirejs.config(require("./config"));

requirejs(['./app', 'http', './routes', './models/RoomModel', './models/UserModel', 'socket.io'],
  function(app, http, routes, Room, User, socketio){
  var server = http.createServer(app),
      io = socketio.listen(server, {origins: '*:*', log: false});

  // Routing table
  app.get('/', routes.index);


  /* Consumption code */
  var Users = {};
  var currentRoom = Room(io);

  io.sockets.on('connection', function(socket){
    // Check to see if the current room is full and create a new one if so
    if( currentRoom.isFull() ){
      currentRoom = Room(io);
    }

    // Create a user and link it to its corresponding socket connection
    var user = User(socket);
    currentRoom.addUser(user);
    user.setCurrentRoom(currentRoom);

    // Check again if the room is now full, and start the game if so
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
      console.log('Client disconnected');
    });
  });

  server.listen(app.get('port'), function(){
    console.log("Express server listening on port " + app.get('port'));
  });

});
