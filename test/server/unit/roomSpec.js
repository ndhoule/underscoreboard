var User = stubs.User;
var Room = require('../../../lib/rooms/room');

describe('Room', function() {
  beforeEach(function() {
    this.clock = sinon.useFakeTimers();

    this.room = new Room();
    this.users = [new User(), new User()];
  });

  xdescribe('#count', function() {
    it('should provide a count of the users in the room', function() {
      expect(this.room.count()).to.equal(0);

      this.room.addUser(this.users[0]);
      this.room.addUser(this.users[1]);

      expect(this.room.count()).to.equal(2);

      this.room.removeUser(this.users[0]);
      this.room.removeUser(this.users[1]);

      expect(this.room.count()).to.equal(0);
    });
  });

  xdescribe('#contains', function() {
    beforeEach(function() {
      this.room.addUser(this.users[0]);
    });

    it('should return true if the room contains a given user', function() {
      expect(this.room.contains(this.users[0])).to.be.true;
    });

    it('should return false if the room does not contain a given user', function() {
      expect(this.room.contains(this.users[1])).to.be.false;
    });
  });

  xdescribe('#addUser', function() {
    it('should add a user to the room', function() {
      this.room.addUser(this.users[0]);

      expect(this.room.contains(this.users[0])).to.be.true;
    });

    it('should allow multiple users to be in the room', function() {
      this.room.addUser(this.users[0]);
      this.room.addUser(this.users[1]);

      expect(this.room.count()).to.equal(2);
    });

    it('should throw an error when trying to add a user to a full room', function() {
      this.room.addUser(this.users[0]);
      this.room.addUser(this.users[0]);

      expect(function() { this.room.addUser(new User()); }).to.throw(Error);
    });

    it('should emit an event when a user is added', function() {
      var callback = sinon.spy();

      this.room.on('user.join', callback);
      this.room.addUser(this.users[0]);

      expect(callback).to.have.been.calledOnce;
    });

    xit('should only allow user objects to be added to the room', function() {
    });
  });

  xdescribe('#removeUser', function() {
    it('should remove a user from the room', function() {
      this.room.addUser(this.users[0]);

      expect(this.room.contains(this.users[0])).to.be.true;

      this.room.removeUser(this.users[0]);

      expect(this.room.contains(this.users[0])).to.be.false;
    });

    it('should not remove users from an empty room', function() {
      expect(this.room.isEmpty()).to.be.true;
      expect(this.room.removeUser).to.throw(Error);
    });

    it('should emit an event when a user is removed', function() {
      var callback = sinon.spy();

      this.room.on('user.part', callback);

      this.room.addUser(this.users[0]);
      this.room.removeUser(this.users[0]);

      expect(callback).to.have.been.calledOnce;
    });

    it('should not emit an event when user removal fails', function() {
      var callback = sinon.spy();

      this.room.on('user.part', callback);

      this.room.addUser(this.users[0]);
      this.room.removeUser(this.users[1]);

      expect(callback).to.not.have.been.called;
    });

    xit('should only allow user objects to be removed from the room', function() {
    });
  });
});
