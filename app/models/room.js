/*jshint node:true, laxcomma:true*/
/*globals define: true*/
"use strict";

define(function(require) {
  var functions  = require('./functions.json'),
      uuid       = require('node-uuid');

  // Create a room prototype
  var room = {};

  room.initGame = function() {
    if (this.users.length === 2) {
      console.info('Starting game ID ' + this.id);
      this.currentFunction = this.generateFunction();
    } else {
      console.warn("Tried to start a game with only " + this.users.length + " players.");
    }
  };

  room.generateFunction = function() {
    var randomFunction,
        randomIndex,
        pool = [],
        maxDifficulty = 1;

    // Always return _.each during the first round. Helps prevent advanced
    // functions from being presented at first load.
    if (this.round === 1) {
      this.round++;
      return functions.each;
    }

    // Create a list of functions from which we can pull a random function.
    // Creating this list lets us limit our pool by difficulty level.
    for (var key in functions) {
      if(functions[key].difficulty <= maxDifficulty) {
        pool.push(functions[key]);
      }
    }

    // Find our random function by grabbing a random index limited by the
    // pool size.
    randomIndex = Math.floor(Math.random() * pool.length);

    // Return the random function.
    return pool[randomIndex];
  };

  room.isFull = function() {
    return this.users.length === 2;
  };

  room.isEmpty = function() {
    return this.users.length === 0;
  };

  room.addUser = function(user) {
    if (this.isFull()) {
      throw new Error("Cannot add users to a full room.");
    }

    // Subscribe a user to this room's socket broadcasts
    user.socket.join(this.id);

    // Tell the user it belongs to this room
    user.room = this;

    // Add the user to the current room's users array
    return this.users.push(user);
  };

  room.removeUser = function(user) {
    if (this.isEmpty()) {
      throw new Error("Cannot remove users from an empty room.");
    }

    this.users.forEach(function(val, i, arr) {
      if (val === user) {
        arr.splice(i, 1);
      }
    });

    if (this.users.length > 0) {
      // Reset the room's state
      this.round = 1;
      this.currentFunction = null;
    }
  };

  room.updateEditor = function(data, socket) {
    socket.broadcast.to(this.id).emit('updateEditor', data);
  };

  room.victory = function(ignore, socket) {
    socket.broadcast.to(this.id).emit('victory');
    return this.initGame();
  };

  // Return a maker function
  return function(io) {
    var instance = Object.create(room, {
      id: {
        value: uuid.v4()
      },
      users: {
        value: [],
        writable: true
      },
      round: {
        value: 1,
        writable: true
      },
      currentFunction: {
        value: null,
        writable: true
      }
    });

    return instance;
  };
});
