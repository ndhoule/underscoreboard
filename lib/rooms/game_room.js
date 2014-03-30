'use strict';

var _ = require('lodash');
var Room = require('./room');
var installSocketExtensions = require('./socket_extensions');
var functions = require('../functions.json');

var GameRoom = function(socket) {
  Room.call(this, socket);

  installSocketExtensions(this);

  this.on('user.join', _.bind(function() {
    this.isFull() && this.initGame();
  }, this));

  Object.defineProperties(this, {
    currentFunction: { value: null, writable: true },
    round: { value: 1, writable: true }
  });
};

GameRoom.prototype = Object.create(Room.prototype);
GameRoom.prototype.constructor = GameRoom;

GameRoom.prototype.removeUser = function(target) {
  Room.prototype.removeUser.call(this, target);

  // Reset the room's state if there are still users in it
  if (this.users.length > 0) {
    this.round = 1;
    this.currentFunction = null;
  }
};

GameRoom.prototype.getRandomFunction = function() {
  var pool;
  var maxDifficulty = 1;

  // Create a list of functions from which we can pull a random function.
  pool = _.filter(functions, function(func) {
    return func.difficulty <= maxDifficulty;
  });

  return pool[_.random(0, pool.length - 1)];
};

GameRoom.prototype.endGame = function(user) {
  Underscoreboard.log.info('Ending game ID %s.', this.id);
  this.emit('game.end', user);
};

GameRoom.prototype.initGame = function() {
  if (this.isFull()) {
    Underscoreboard.log.info('Starting game ID %s', this.id);

    this.currentFunction = this.round === 1 ? functions.each : this.getRandomFunction();
    this.round += 1;

    this.emit('game.start');
  } else {
    Underscoreboard.log.error('Tried to start game ID %s with %d players.', this.id, this.users.length);
  }
};

module.exports = GameRoom;
