(function(){
  'use strict';

  define(function() {
    // Export the User model we create in this file. Accepts a socket as an argument
    // and upon instantiation, links the user to that socket.
    return function(socket) {
      if (!socket) {
        throw new Error('Cannot create a user without linking it to a socket.');
      }

      var user = {};

      var instance = Object.create(user, {
        socket: {
          value: socket
        },
        id: {
          value: socket.id
        },
        room: {
          value: null,
          writable: true
        }
      });

      return instance;
    };
  });
}());
