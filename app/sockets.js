define(['lodash', 'socket.io', 'roomModel', 'userModel'], function(_, socket, Room, User){
  return function(server) {
    var io = socket.listen(server, {log:false});

    // Set up containers for users and rooms.
    var rooms = {
      full      : {},
      available : []
    };

    io.sockets.on('connection', function(socket) {
      // Create a user and link it to its socket connection
      var user = User(socket);
      console.info('Client ID ' + user.getID() + ' connected');

      // Check if there's a room available to join. If not, create one
      if (rooms.available[0] === undefined) {
        rooms.available[0] = (Room(io));
      }

      // Get a handle on the first available room
      var userRoom = rooms.available[0];

      // Add the user to the room.
      userRoom.addUser(user);

      // Check if the room is now full...
      if (userRoom.isFull()){
        // ...and start the game if so
        userRoom.initGame();

        // If the room is full, remove it from the list of available rooms and
        // move it to the full rooms list
        var fullRoom = rooms.available.shift();
        rooms.full[fullRoom.getID()] = fullRoom;
      }

      // Broadcast changes to a room's users
      socket.on('editorChange', function(data) {
        user.getCurrentRoom().updateEditor(data, socket);
      });

      // Broadcast a victory event to non-winners
      socket.on('victory', function(data) {
        // Only broadcast if the room is full
        if (user.getCurrentRoom().isFull()) {
          user.getCurrentRoom().victory(data, socket);
        }
      });

      socket.on('disconnect',function() {
        console.info('Player disconnected');

        // Get a handle on the user's current room
        var userCurrentRoom = user.getCurrentRoom();

        // Remove the user from their room
        userCurrentRoom.removeUser(user);

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
          console.info('Room has an empty spot. Moving it to the available stack...');
          rooms.available.push(rooms.full[userCurrentRoom.getID()]);
          delete rooms.full[userCurrentRoom.getID()];

          console.info('Room ' + rooms.available[0].getID() + ' was moved to the available stack' );
        }
      });
    });

    return io;
  };
});
