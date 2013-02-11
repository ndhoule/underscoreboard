/*jshint node:true*/
/*globals define: true*/
"use strict";

define(function() {
  // Export the User model we create in this file. Accepts a socket as an argument
  // and upon instantiation, links the user to that socket.
  return function(socket) {
    if (!socket) {
      throw new Error("Cannot create a user without linking it to a socket.");
    }

    var userSocket = socket;
    var currentRoom = null;
    var uid = socket.id;

    // Declare methods to put on the User object. We'll expose some of these as
    // public methods when we return a User object

    // Set the room the user currently occupies
    var publicSetCurrentRoom = function(room) {
      return currentRoom = room;
    };

    // Return the room the user currently occupies
    var publicGetCurrentRoom = function() {
     return currentRoom;
    };

    // Return the socket bound to this user
    var publicGetSocket = function() {
      return userSocket;
    };

    // Get this user's ID. The ID returned is that of the socket ID the user is
    // bound to.
    var publicGetID = function() {
      return uid;
    };

    // Return the user and expose its interface.
    return {
      setCurrentRoom : publicSetCurrentRoom,
      getCurrentRoom : publicGetCurrentRoom,
      getSocket      : publicGetSocket,
      getID          : publicGetID,
    };
  };
});
