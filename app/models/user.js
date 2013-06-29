define(['node-uuid'], function(uuid) {
  'use strict';

  return function(socket) {
    return Object.create(null, {
      _socket: {
        value: socket,
        writable: true
      },
      id: {
        value: uuid.v4()
      },
      room: {
        value: null,
        writable: true
      }
    });
  };
});
