define(['lodash', 'socket.io', 'roomModel', 'userModel'], function(_, socket, createRoom, createUser){
  return function(server) {
    var io = socket.listen(server, {log:false});

    // Set up containers for users and rooms.
    var rooms = {
      full      : {},
      available : []
    };

    // TODO: Refactor functionality into functions
    io.sockets.on('connection', function(socket) {
      // Create a user and link it to its socket connection
      var user = createUser(socket);
      console.info('Client ID ' + user.id + ' connected');

      // Check if there's a room available to join. If not, create one
      if (rooms.available[0] === undefined) {
        rooms.available[0] = createRoom(io);
      }

      // Get a handle on the first available room
      var userRoom = rooms.available[0];

      // Add the user to the room.
      userRoom.addUser(user);

      // Check if the room is now full...
      if (userRoom.isFull()){
        // ...and start the game if so
        userRoom.initGame();
        io.sockets.in(userRoom.id).emit('beginGame', userRoom.currentFunction);

        // If the room is full, remove it from the list of available rooms and
        // move it to the full rooms list
        var fullRoom = rooms.available.shift();
        rooms.full[fullRoom.id] = fullRoom;
      }

      // Broadcast changes to a room's users
      socket.on('editorChange', function(data) {
        user.room.updateEditor(data, socket);
      });

      // Broadcast a victory event to non-winners
      socket.on('victory', function(data) {
        // Only broadcast if the room is full
        if (user.room.isFull()) {
          user.room.victory(data, socket);

          // Start another game after 2.5 seconds
          setTimeout(function() {
            io.sockets.in(userRoom.id).emit('beginGame', userRoom.currentFunction);
          }, 2500);
        }
      });

      socket.on('disconnect',function() {
        console.info('Player disconnected');

        // Get a handle on the user's current room
        var userCurrentRoom = user.room;

        // Remove the user from their room
        userCurrentRoom.removeUser(user);
        io.sockets.in(userCurrentRoom.id).emit('resetRoom', 'Opponent has left.');

        if (userCurrentRoom.isEmpty()) {
          // If it's empty, destroy it from the available rooms stack
          _(rooms.available).each(function(room, i){
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

    return io;
  };
});
