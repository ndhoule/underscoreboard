var User = stubs.User;
var GameRoom = require('../../../lib/rooms/game_room');

describe('GameRoom', function() {
  beforeEach(function() {
    this.clock = sinon.useFakeTimers();

    this.gameRoom = new GameRoom();
    this.users = [new User(), new User()];
  });
});
