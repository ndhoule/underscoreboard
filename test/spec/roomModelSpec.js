var requirejs = require("requirejs");
requirejs.config(require("../../server/config"));

requirejs(['buster', 'userModel'], function(buster, User){
  // Set up BDD-style expectations
  var expect = buster.assertions.expect;
  buster.spec.expose();

  describe('Rooms', function(){

    describe(': they', function(){
      itEventually('should test something', function(){
        expect(true).toEqual(true);
      });
    });

  });
});
