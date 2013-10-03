'use strict';

var _ = require('lodash');
var multiplexer = require('../../config/sockjs/sockjs_server').multiplexer;

var createMessage = function(type, data) {
  if (!type) {
    throw new Error('Socket data cannot be sent without a type.');
  }

  return JSON.stringify({
    type: type,
    data: data
  });
};

// Sends a message to all users in the target room.
var send = function(target, type, data /*, users */) {
  var users = arguments[3] || target.users;

  _.each(users, function(user) {
    user._socket.write(createMessage(type, data));
  });
};

// Sends a message to all users in the target room, less an ID blacklist.
var broadcast = function(target, type, data, excludes) {
  !_.isArray(excludes) && (excludes = [excludes]);

  send(target, type, data, _.reject(target.users, function(user) {
    return _.contains(excludes, user.id);
  }));
};

module.exports = function(room) {
  Object.defineProperties(room, {
    _channel: { value: multiplexer, writable: false }
  });

  room.on('user.part', function() {
    send(room, 'user.part');
  });

  room.on('editor.change', function(message) {
    broadcast(room, 'editor.change', message.data, message.sender);
  });

  room.on('game.start', function() {
    send(room, 'game.start', room.currentFunction);
  });

  room.on('game.end', function(user) {
    send(room, 'game.end', user.id);
  });
};
