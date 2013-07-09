'use strict';

var uuid = require('node-uuid');

var createRoom = function(socket) {
  return Object.create(null, {
    _socket: {
      value: socket,
      writable: true
    },
    id: {
      value: uuid.v4(),
      writable: false
    },
    room: {
      value: null,
      writable: true
    }
  });
};

module.exports = createRoom;
