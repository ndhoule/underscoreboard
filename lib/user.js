'use strict';

var User = function(socket) {
  return Object.defineProperties(this, {
    _socket: {
      value: socket,
      writable: true
    },
    id: {
      value: require('node-uuid').v4(),
      writable: false
    },
    room: {
      value: null,
      writable: true
    }
  });
};

User.prototype = Object.create(require('eventemitter2').EventEmitter2.prototype);

module.exports = User;
