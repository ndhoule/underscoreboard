define(['lodash', 'node-uuid', '../lib/functions.json'], function(_, uuid, functions) {
  'use strict';

  var createMessage = function(type, data) {
    if (!type) {
      throw new Error('Socket data cannot be sent without a type.');
    }

    return JSON.stringify({
      type: type,
      data: data
    });
  };

  // Main room object
  var room = Object.create(null);

  room.initGame = function() {
    if (this.users.length === 2) {
      winston.log('info', 'Starting game ID %s', this.id);
      this.currentFunction = this.generateFunction();
    } else {
      winston.log('error', 'Tried to start game %s with %d players.', this.id, this.users.length);
    }
  };

  room.generateFunction = function() {
    var pool,
        maxDifficulty = 1;

    // Always return _.each during the first round. Prevents advanced functions
    // from being presented during the first round.
    if (this.round === 1) {
      this.round += 1;
      return functions.each;
    }

    // Create a list of functions from which we can pull a random function.
    // Creating this list lets us limit our pool by difficulty level.
    pool = _.filter(functions, function(func) {
      if (func.difficulty <= maxDifficulty) {
        return func;
      }
    });

    // Return a random function.
    return pool[_.random(0, pool.length - 1)];
  };

  room.isFull = function() {
    return this.users.length === 2;
  };

  room.isEmpty = function() {
    return this.users.length === 0;
  };

  room.addUser = function(user) {
    if (this.isFull()) {
      throw new Error('Cannot add users to a full room.');
    }

    // Tell the user it belongs to this room
    user.room = this;

    // Add the user to the current room's users array
    return this.users.push(user);
  };

  room.removeUser = function(user) {
    if (this.isEmpty()) {
      throw new Error('Cannot remove users from an empty room.');
    }

    this.users.forEach(function(val, i, arr) {
      val === user && arr.splice(i, 1);
    });

    if (this.users.length > 0) {
      // Reset the room's state
      this.round = 1;
      this.currentFunction = null;
    }
  };

  room.updateEditor = function(message) {
    this.broadcast(message.type, message.data, message.sender);
  };

  room.victory = function(message) {
    this.broadcast(message.type, message.data, message.sender);
    this.initGame();
  };

  // Emit a message to all users in a room
  room.emit = function(type, data) {
    _.each(this.users, function(user) {
      user._socket.write(createMessage(type, data));
    });
  };

  // Emit a message to all users except for those blacklisted
  room.broadcast = function(type, data, excludes) {
    !Array.isArray(excludes) && (excludes = [excludes]);

    _.each(this.users, function(user) {
      !_.contains(excludes, user.id) && user._socket.write(createMessage(type, data));
    });
  };

  // Creates a room. Links that room to a channel; in this case, a SockJS
  // websocket.
  return function(channel) {
    var instance = Object.create(room, {
      _channel: { value: channel, writable: true },
      id: { value: uuid.v4() },
      currentFunction: { value: null, writable: true },
      round: { value: 1, writable: true },
      users: { value: [], writable: true }
    });

    return instance;
  };
});
