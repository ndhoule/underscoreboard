/*global _: false, path: false, appDir: false*/
'use strict';

var makeRoom = require(path.join(appDir, 'models/room'));

describe('Room:', function() {
  var room;

  beforeEach(function() {
    room = makeRoom();
  });

  // Meta :: Test coverage for the room's public API
  it('should be a function', function() {
    expect(makeRoom).to.be.a('function');
  });

  it('should create an object when called', function() {
    expect(room).to.be.an('object');
  });

  it('should have only a predefined set of methods', function() {
    var methods = [
      'initGame',
      'generateFunction',
      'isFull',
      'isEmpty',
      'addUser',
      'removeUser',
      'updateEditor',
      'victory',
      'emit',
      'broadcast'
    ];

    for (var key in room) {
      // Ignore properties that aren't part of the public API
      if (key[0] !== '_') {
        expect(_.indexOf(methods, key)).to.not.equal(-1);
        expect(room[key]).to.be.a('function');
      }
    }
  });
});
