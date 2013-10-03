'use strict';

var _ = require('lodash');
var EventEmitter2 = require('eventemitter2').EventEmitter2;

var Room = function(/* config */) {
  var config = _.isObject(arguments[0]) ? arguments[0] : { MAX_USERS: 2 };

  EventEmitter2.call(this, {
    wildcard: true
  });

  Object.defineProperties(this, {
    config: { value: config, writable: true },
    id: { value: require('node-uuid').v4() },
    users: { value: [], writable: true }
  });
};

Room.prototype = Object.create(EventEmitter2.prototype);
Room.prototype.constructor = Room;

Room.prototype.isFull = function() {
  return this.users.length === this.config.MAX_USERS;
};

Room.prototype.isEmpty = function() {
  return this.users.length === 0;
};

Room.prototype.count = function() {
  return this.users.length;
};

Room.prototype.contains = function(user) {
  return _.indexOf(this.users, user) !== -1;
};

Room.prototype.addUser = function(user) {
  if (this.isFull()) {
    throw new Error('Cannot add users to a full room.');
  }

  // Attach the user to this room bidirectionally
  user.room = this;
  this.users.push(user);

  this.emit('user.join');

  return this;
};

Room.prototype.removeUser = function(target) {
  var oldUserCount;

  if (this.isEmpty()) {
    throw new Error('Cannot remove users from an empty room.');
  }

  oldUserCount = this.count();

  this.users = _.reject(this.users, function(user) {
    return user === target;
  });

  // If a user was successfully removed, broadcast an event
  if (oldUserCount - this.count() > 0) {
    this.emit('user.part');
  }

  return this;
};

module.exports = Room;
