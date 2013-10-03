'use strict';

var winston = require('winston');
var sockjsServer = require('./index').server;
var handleMessage = require('./sockjs_handlers');
var Queue = require('../../lib/queue');
var Room = require('../../lib/rooms/game_room');
var User = require('../../lib/user');

// Set up sockjs multiplexing; this lets us emulate channels using a single
// sockjs connection

var users = Object.create(null);

var rooms = {
  full: Object.create(null),
  available: new Queue()
};

sockjsServer.on('connection', function(conn) {
  var user = users[conn.id] = new User(conn);

  user._socket.write(JSON.stringify({
    type: 'acknowledge',
    data: { id: user.id }
  }));

  // Check if there's an available room to join. If not, create one and
  // register a multiplexer channel for it; we'll use this channel to
  // communicate with the room's users
  if (!rooms.available.peek()) {
    rooms.available.enqueue(new Room());
    rooms.available.peek();
  }

  // Add the user to the first available room
  rooms.available.peek().addUser(user);

  if (rooms.available.peek().isFull()) {
    rooms.full[user.room.id] = rooms.available.remove(user.room);
  }

  conn.on('data', function(message) {
    // Add the sender to the message so we can do filtering in broadcasts
    message = JSON.parse(message);
    message.sender = user.id;

    handleMessage(user, message);
  });

  conn.on('close', function() {
    var userCurrentRoom = user.room;

    winston.log('info', 'Player ID %s disconnected.', user.id);

    userCurrentRoom.removeUser(user);

    // If the room is now empty, remove it from the available rooms stack.
    // Otherwise, move it from the full rooms object to the available stack
    if (userCurrentRoom.isEmpty()) {
      rooms.available.remove(user.room);
    } else {
      rooms.available.enqueue(rooms.full[userCurrentRoom.id]);
      delete rooms.full[userCurrentRoom.id];

      winston.log('info', 'Room ID %s was moved to the available stack.', rooms.available.peek().id);
    }
  });
});

module.exports = sockjsServer;
