var requirejs = require("requirejs");
requirejs.config(require("../../app/require-config"));

requirejs(['buster', 'userModel'], function(buster, User) {
  // Set up BDD-style expectations
  var expect = buster.assertions.expect;
  buster.spec.expose();

  describe('Users', function() {
    var fakeSocket, user;

    before(function() {
      fakeSocket = {};
      user = User(fakeSocket);
    });

    describe('getSocket', function() {
      it('should return the socket the user was instantiated with', function() {
        expect(user.getSocket()).toEqual(fakeSocket);
      });
    });

  });
});
