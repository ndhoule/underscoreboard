define(['socket.io', 'roomModel', 'userModel'], function(socket, Room, User){
  return function(server) {
    var io = socket.listen(server, {log:false});

    // Set up containers for users and rooms.
    var currentRoom;
    var Users = {};
    var Rooms = {};

    // Create an initial room and put it in the rooms hash.
    currentRoom = Room(io);
    Rooms[currentRoom.getID()] = currentRoom;

    io.sockets.on('connection', function(socket) {
      // Check to see if the current room is full and create a new one if so.
      // Stick it in the Rooms hash so we can refer to it later.
      if (currentRoom.isFull()){
        currentRoom = Room(io);
        Rooms[currentRoom.getID()] = currentRoom;
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

      socket.on('victory', function(data) {
        user.getCurrentRoom().victory(data, socket);
      });

      socket.on('disconnect',function() {
        var userRoom = user.getCurrentRoom();

        // Remove the user from their room
        userRoom.removeUser(user);

        // Delete the room if it's empty
        if (userRoom.isEmpty()) {
          delete Rooms[userRoom.getID()];
        }
      });
    });

    return io;
  };
});
