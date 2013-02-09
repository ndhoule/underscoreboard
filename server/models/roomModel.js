/*jshint node:true, laxcomma:true*/
/*globals define: true*/
"use strict";

define(function(require) {
  var fns  = require('./functions.json'),
      _    = require('lodash'),
      uuid = require('node-uuid');

  return function(io) {
    // Generate a UUID for the room
    var roomID = uuid.v4();
    var users = [];
    var round = 1;
    var currentFn = null;

    return {

      initGame: function() {
        console.log('starting game id ' + roomID);
        currentFn = this.genRandomFn();
        io.sockets.in(roomID).emit('beginGame', currentFn);
      },

      genRandomFn: function() {
        var randProp,
            randIndex,
            keys = [],
            maxDifficulty = 1;

        console.log('Starting round ' + this.getRound());

        // Always return _.each during the first round.
        // TODO: Rudimentary round changing works but increases round too often,
        // so it's limited to here. Fix this.
        if (this.getRound() === 1) {
          this.increaseRound();
          return fns.each;
        }

        _.each(fns, function(val, prop) {
          keys.push(prop);
        });

        randIndex = Math.floor(Math.random() * _.size(keys));
        randProp = keys[randIndex];


        // Hacky fix for difficulty levels; make sure we only return functions
        // that are of difficulty level 0 or 1.
        if (fns[randProp].difficulty > maxDifficulty) {
          console.log("Function too difficult. Generating a different function...");
          return this.genRandomFn();
        }

        return fns[randProp];
      },

      getRound: function() {
        return round;
      },

      increaseRound: function() {
        return ++round;
      },

      // Checks if the room is full. Returns true if yes, false if no.
      isFull: function() {
        return users.length >= 2;
      },

      // Adds a user to the room's users array and subscribes them to this
      // room's broadcasts.
      addUser: function(user) {
        // TODO: Fix this security hole--isFull could be redefined by user
        if ( this.isFull() ) { throw new Error("Cannot add users to a full room."); }

        // Subscribe a user to this room's socket broadcasts
        user.getSocket().join(roomID);
        return users.push(user);
      },

      // Remove a user from the current room.
      removeUser: function(user) {
        //TODO: Implement garbage collection on rooms
      },

      // Return an array containing all users in the room.
      getUsers: function() {
        return users;
      },

      getID: function() {
        return roomID;
      },

      // Broadcast the contents of a user's editor to that user's room.
      updateEditor: function(data, socket) {
        socket.broadcast.to(roomID).emit('updateEditor', data);
      },

      sweetVictory: function(data, socket) {
        socket.broadcast.to(roomID).emit('sweetVictory', data);
        setTimeout(this.initGame(), 2500);
      }

    };
  };
});
