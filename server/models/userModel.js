/*jshint node:true*/
/*globals define: true*/
"use strict";

define(function() {

  return function(socket) {
    // TODO: More robust checking here
    if (!socket) {
      throw new Error("Cannot create a user without linking it to a socket.");
    }

    var userSocket = socket;
    var currentRoom = null;
    var uid = socket.id;
    return {

      setCurrentRoom: function(room) {
        return currentRoom = room;
      },

      getCurrentRoom: function() {
        return currentRoom;
      },

      getSocket: function() {
        return userSocket;
      },

      getID: function() {
        return uid;
      }
    };
  };

});
