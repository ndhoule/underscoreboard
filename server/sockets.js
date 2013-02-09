define(['socket.io', 'roomModel', 'userModel'], function(socket, Room, User){
  return function(server) {
    var io = socket.listen(server, {log:false});

    // Set up Users container and create an initial room. Future rooms will be
    // created by socket events.
    var Users = {};
    var currentRoom = Room(io);

    io.sockets.on('connection', function(socket) {
      // Check to see if the current room is full and create a new one if so
      if (currentRoom.isFull()){
        currentRoom = Room(io);
      }

      // Create a user and link it to its corresponding socket connection
      var user = User(socket);
      currentRoom.addUser(user);
      user.setCurrentRoom(currentRoom);

      // Check again if the room is now full, and start the game if so
      if (currentRoom.isFull()){
        currentRoom.initGame();
      }

      // Broadcast changes to a room's users
      socket.on('editorChange', function(data) {
        user.getCurrentRoom().updateEditor(data, socket);
      });

      socket.on('sweetVictory', function(data) {
        user.getCurrentRoom().sweetVictory(data, socket);
      });

      socket.on('disconnect',function() {
        console.log('Client disconnected');
      });
    });

    return io;
  };
});
