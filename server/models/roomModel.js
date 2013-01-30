/*jshint node:true, laxcomma:true*/
/*globals define: true*/
"use strict";

define(function(require){
  var fns = require('./functions.json'),
      _   = require('lodash');


  // TODO: Get rid of io arg as dependency
  return function(io){
    var roomID = makeID(10);
    var users = [];
    var currentFn = null;

    function makeID(len){
        var CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        var id = "";
        for (var i = 0, idLen = len || 10; i < idLen; i++) {
          id += CHARSET.charAt(Math.floor(Math.random() * CHARSET.length));
        }
        return id;
    }

    return {

      initGame: function(){
        console.log('starting game id ' + roomID);
        currentFn = this.genRandomFn();
        io.sockets.in(roomID).emit('beginGame', currentFn);
      },

     genRandomFn: function(){
        var randProp,
            randIndex,
            keys = [];

        _.each(fns, function(val, prop){
          keys.push(prop);
        });

        randIndex = Math.floor(Math.random() * _.size(keys));
        randProp = keys[randIndex];

        return fns[randProp];
      },

      // Checks if the room is full. Returns true if yes, false if no.
      isFull: function(){
        return users.length >= 2;
      },

      // Adds a user to the room's users array and subscribes them to this
      // room's broadcasts.
      addUser: function(user){
        // TODO: Fix this security hole--isFull could be redefined by user
        if ( this.isFull() ) { throw new Error("Cannot add users to a full room."); }

        // Subscribe a user to this room's socket broadcasts
        user.getSocket().join(roomID);
        return users.push(user);
      },

      // Remove a user from the current room.
      removeUser: function(user){
        //TODO: Implement garbage collection on rooms
      },

      // Return an array containing all users in the room.
      getUsers: function(){
        return users;
      },

      getID: function(){
        return roomID;
      },

      // Broadcast the contents of a user's editor to that user's room.
      updateEditor: function(data, socket){
        socket.broadcast.to(roomID).emit('updateEditor', data);
      },

      sweetVictory: function(data, socket){
        socket.broadcast.to(roomID).emit('sweetVictory', data);
      }

    };
  };

});
