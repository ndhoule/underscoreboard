(function(){
  'use strict';

  define(['node-uuid'], function(uuid) {
    return function(socket) {
      return Object.create({}, {
        _socket: { value: socket, writable: true },
        id: { value: uuid.v4() },
        room: { value: null, writable: true }
      });
    };
  });
}());
