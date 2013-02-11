/*jshint node:true, laxcomma:true*/
/*globals define: true*/
"use strict";

define(function(require) {
  var underscoreFunctions  = require('./functions.json'),
      _    = require('lodash'),
      uuid = require('node-uuid');

  // Export the Room module we create in this file.
  return function(io) {
    // Generate a UUID for the room
    var roomID = uuid.v4();
    var users = [];
    var round = 1;
    var currentFn = null;

    // Declare the room's utility methods. We'll later expose some of these as
    // public methods when we return a Room object
    var publicInitGame = function() {
      console.log('starting game id ' + roomID);
      currentFn = privateGenerateRandomFunction();
      io.sockets.in(roomID).emit('beginGame', currentFn);
    };

    // Returns a random function from our list of underscore functions. We'll
    // broadcast this function to the room's members on round start
    var privateGenerateRandomFunction = function() {
      var randomFunction,
          randomIndex,
          keys = [],
          maxDifficulty = 1;

      // Always return _.each during the first round. Helps prevent advanced
      // functions from being presented at first load.
      if (publicGetRound() === 1) {
        privateIncreaseRound();
        return underscoreFunctions.each;
      }

      // Create a list of functions from which we can pull a random function.
      // Creating this list lets us limit our pool by difficulty level.
      _.each(underscoreFunctions, function(val, prop) {
        if (prop.difficulty <= maxDifficulty) {
          keys.push(prop);
        }
      });

      // Find our random function by grabbing a random index limited by the
      // pool size.
      randomIndex = Math.floor(Math.random() * _.size(keys));
      randomFunction = keys[randomIndex];

      return underscoreFunctions[randomFunction];
    };

    // Returns the current round number of the room
    var publicGetRound = function() {
      return round;
    };

    // Increases the round number of the room and returns the current round number
    var privateIncreaseRound = function() {
      return ++round;
    };

    // Checks if the room is full. Returns true if yes, false if no.
    var publicIsFull = function() {
      return users.length >= 2;
    };

    // Checks if the room is empty. Returns true if yes, false if no.
    var publicIsEmpty = function() {
      return users.length === 0;
    };

    // Adds a user to the room's users array and subscribes them to this
    // room's broadcasts. Returns the population of the room in int form.
    var publicAddUser = function(user) {
      if (publicIsFull()) {
        throw new Error("Cannot add users to a full room.");
      }

      // Subscribe a user to this room's socket broadcasts
      user.getSocket().join(roomID);
      // Add the user to the current room's users array
      return users.push(user);
    };

    // Removes a user from the current room.
    var publicRemoveUser = function(user) {
      if (publicIsEmpty()) {
        throw new Error("Cannot remove users from an empty room.");
      }

      _.each(users, function(val, i, arr) {
        if (val === user) {
          arr.splice(i, 1);
        }
      });
    };

    // Return an array containing all users in the room.
    var publicGetUsers = function() {
      return users;
    };

    // Return the room's ID
    var publicGetID = function() {
      return roomID;
    };

    // Broadcast the contents of a user's editor to that user's room.
    var publicUpdateEditor = function(data, socket) {
      socket.broadcast.to(roomID).emit('updateEditor', data);
    };

    // When a user's tests pass, they send a victory event to the server.
    // Here, we broadcast that event to the other player.
    var publicVictory = function(data, socket) {
      socket.broadcast.to(roomID).emit('victory', data);

      // Start another game after 2.5 seconds.
      setTimeout(publicInitGame(), 2500);
    };

    // Return the room and expose its interface.
    return {
      initGame     : publicInitGame,
      getRound     : publicGetRound,
      isFull       : publicIsFull,
      isEmpty      : publicIsEmpty,
      addUser      : publicAddUser,
      removeUser   : publicRemoveUser,
      getUsers     : publicGetUsers,
      getID        : publicGetID,
      updateEditor : publicUpdateEditor,
      victory      : publicVictory
    };
  };
});
