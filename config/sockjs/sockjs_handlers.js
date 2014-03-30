'use strict';

var _ = require('lodash');
var winston = require('winston');

var handlers = Object.create(null);

handlers.editor = Object.create(null);

handlers.editor.change = function(user, message) {
  user.room.emit('editor.change', message);
};

handlers.game = Object.create(null);

handlers.game.victory = function(user) {
  if (user.room.isFull()) {
    // Send an end game signal and start a new game after a short delay
    user.room.endGame(user);
    setTimeout(_.bind(user.room.initGame, user.room), 2500);
  }
};

// Default handler. Gets called when the user sends a message for which there is
// no handler defined.
handlers.fallback = function(user, message) {
  winston.log('warn', 'Unrecognized message type received from client:', message.type);
};

module.exports = function(user, message) {
  var type = message.type.split('.');

  if (type.length === 2) {
    if (_.has(handlers, type[0]) && _.has(handlers[type[0]], type[1])) {
      handlers[type[0]][type[1]](user, message);
      return;
    }
  }

  if (type.length === 1) {
    if (_.has(handlers, type[0])) {
      handlers[type[0]](user, message);
      return;
    }
  }

  handlers.fallback(user, message);
};
