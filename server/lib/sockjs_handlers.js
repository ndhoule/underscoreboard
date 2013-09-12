'use strict';

var multiplexer, users, rooms,
    path = require('path'),
    websocket_multiplex = require('websocket-multiplex'),
    winston = require('winston'),
    sockjs_server = require(path.join(__dirname, '..', 'config/sockjs_server')),
    makeQueue = require(path.join(__dirname, '..', 'lib/queue')),
    makeRoom = require(path.join(__dirname, '..', 'models/room')),
    makeUser = require(path.join(__dirname, '..', 'models/user'));


// Set up sockjs multiplexing; this lets us emulate channels using only a
// single socket connection
multiplexer = new websocket_multiplex.MultiplexServer(sockjs_server);

// Set up containers for users and rooms
users = Object.create(null);
rooms = {
  full: Object.create(null),
  available: makeQueue()
};

sockjs_server.on('connection', function(conn) {
  var user;

  // Create a user and record that user's socket connection's ID
  users[conn.id] = makeUser(conn);
  user = users[conn.id];

  // Check if there's an available room to join. If not, create one and
  // register a multiplexer channel for it; we'll use this channel to
  // communicate with the room's users
  if (!rooms.available.peek()) {
    rooms.available.enqueue(makeRoom(multiplexer));
  }

  // Add the user to the first available room
  rooms.available.peek().addUser(user);

  // Check if the room is now full and start the game if so
  if (user.room.isFull()) {
    user.room.initGame();
    user.room.emit('beginGame', user.room.currentFunction);

    // If the room is full, remove it from the list of available rooms and
    // move it to the full rooms list
    rooms.full[user.room.id] = rooms.available.remove(user.room);
  }

  conn.on('data', function(message) {
    // TODO: Refactor into parseMessage function
    message = JSON.parse(message);
    // Add the sender to the message so we can do filtering in broadcasts
    message.sender = user.id;

    switch (message.type) {
    case 'editorChange':
      user.room.updateEditor(message);
      break;

    case 'victory':
      if (user.room.isFull()) {
        user.room.victory(message);

        // Start another game after 2.5 seconds
        setTimeout(function() {
          user.room.emit('beginGame', user.room.currentFunction);
        }, 2500);
      }
      break;

    default:
      winston.log('warn', 'Unrecognized message received from client:', message);
    }
  });

  conn.on('close', function() {
    // Get a handle on the user's current room
    var userCurrentRoom = user.room;

    winston.log('info', 'Player disconnected.');

    // Remove the user from their room
    userCurrentRoom.removeUser(user);
    userCurrentRoom.emit('resetRoom', 'Opponent has left.');

    if (userCurrentRoom.isEmpty()) {
      // If it's empty, destroy it from the available rooms stack
      rooms.available.remove(user.room);
    } else {
      // Move it from the full rooms object to the available stack
      rooms.available.enqueue(rooms.full[userCurrentRoom.id]);
      delete rooms.full[userCurrentRoom.id];

      winston.log('info', 'Room ID', rooms.available.peek().id, 'was moved to the available stack.');
    }
  });
});

module.exports = sockjs_server;
