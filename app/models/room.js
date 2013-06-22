/*globals define: true*/

(function(){
  'use strict';

  define(function(require) {
    var functions = require('../lib/functions.json'),
      _ = require('lodash'),
      uuid = require('node-uuid');

    // Main room object
    var room = {};

    room.initGame = function() {
      if (this.users.length === 2) {
        console.info('Starting game ID ' + this.id);
        this.currentFunction = this.generateFunction();
      } else {
        console.error("Tried to start a game with only " + this.users.length + " players.");
      }
    };

    room.generateFunction = function() {
      var pool,
        maxDifficulty = 1;

      // Always return _.each during the first round. Prevents advanced functions
      // from being presented during the first round.
      if (this.round === 1) {
        this.round++;
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
        val === user && arr.splice(i, 1);
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

    // Return a room maker function
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
}());
