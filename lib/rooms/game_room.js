'use strict';

var _ = require('lodash');
var Room = require('./room');
var installSocketExtensions = require('./socket_extensions');
var Prompt = require('../../app/models/prompt');

var GameRoom = function(socket) {
  Room.call(this, socket);

  installSocketExtensions(this);


  this.on('user.join', _.bind(function() {
    if (this.isFull()) {
      this.generateFunctions().then(_.bind(this.initGame, this));
    }
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

GameRoom.prototype.generateFunctions = function() {
  // TODO: Handle errors
  return Prompt.collection()
    .query()
    .where('set', 'underscore')
    .select()
    .then(_.bind(function(prompts) {
      this.prompts = _.sortBy(prompts, 'difficulty');
    }, this));
};

GameRoom.prototype.endGame = function(user) {
  Underscoreboard.log.info('Ending game ID %s.', this.id);
  this.emit('game.end', user);
};

GameRoom.prototype.initGame = function() {
  if (this.isFull()) {
    var index = this.round - 1;

    while (index > this.prompts.length - 1) {
      index -= this.prompts.length - 1;
    }

    this.currentFunction = this.prompts[index];
    this.round += 1;

    Underscoreboard.log.info('Starting game ID %s', this.id);
    this.emit('game.start');
  } else {
    Underscoreboard.log.error('Tried to start game ID %s with %d players.', this.id, this.users.length);
  }
};

module.exports = GameRoom;
