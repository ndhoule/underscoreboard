(function() {
  'use strict';

  define(['sockjs_server', 'websocket-multiplex', 'queue', 'roomModel', 'userModel'], function(sockjs_server, websocket_multiplex, queue, createRoom, createUser) {
    // Set up sockjs multiplexing; this lets us emulate channels using only a
    // single socket connection
    var multiplexer = new websocket_multiplex.MultiplexServer(sockjs_server);

    // Set up containers for users and rooms.
    var users = {};
    var rooms = {
      full: {},
      available: [] // TODO: Replace with true queue
    };

    // TODO: Refactor functionality into smaller functions
    sockjs_server.on('connection', function(conn) {
      // Create a user and record that user's socket connection's ID
      // TODO: Do sockjs objects have ids?
      users[conn.id] = createUser(conn);
      var user = users[conn.id];

      // Check if there's an available room to join. If not, create one and
      // register a multiplexer channel for it; we'll use this channel to
      // communicate with the room's users
      if (!rooms.available[0]) {
        rooms.available[0] = createRoom(multiplexer);
      }

      // Get a handle on the first available room
      var userRoom = rooms.available[0];

      // Add the user to the room.
      userRoom.addUser(user);

      // Check if the room is now full and start the game if so
      if (userRoom.isFull()) {
        userRoom.initGame();
        // TODO: Won't work, sockjs doesn't have the concept of rooms.
        userRoom.emit('beginGame', userRoom.currentFunction);

        // If the room is full, remove it from the list of available rooms and
        // move it to the full rooms list
        var fullRoom = rooms.available.shift();
        rooms.full[fullRoom.id] = fullRoom;
      }

      conn.on('data', function(message) {
        message = JSON.parse(message);
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
              // TODO: Won't work, sockjs doesn't have the concept of rooms.
              user.room.emit('beginGame', userRoom.currentFunction);
            }, 2500);
          }
          break;

        default:
          console.log('Unknown message received from server:', message);
        }
      });

      conn.on('close', function() {
        console.info('Player disconnected');

        // Get a handle on the user's current room
        var userCurrentRoom = user.room;

        // Remove the user from their room
        userCurrentRoom.removeUser(user);
        // TODO: Won't work, sockjs doesn't have the concept of rooms.
        userCurrentRoom.emit('resetRoom', 'Opponent has left.');

        if (userCurrentRoom.isEmpty()) {
          // If it's empty, destroy it from the available rooms stack
          rooms.available.forEach(function(room, i){
            if (room === userCurrentRoom) {
              console.info('Room was vacated. Deleting it from the available stack...');
              rooms.available.splice(i, 1);
            }
          });
        } else {
          // Move it from the full rooms object to the available stack
          rooms.available.push(rooms.full[userCurrentRoom.id]);
          delete rooms.full[userCurrentRoom.id];

          console.info('Room ' + rooms.available[0].id + ' was moved to the available stack' );
        }
      });
    });

    return sockjs_server;
  });
}());
