// Rename this as *Spec.js to include in grunt buster job

var requirejs = require("requirejs");
requirejs.config(require("../../server/config"));

requirejs(['buster'], function(buster){
  // Set up BDD-style expectations
  var expect = buster.assertions.expect;
  buster.spec.expose();

  describe('truth', function(){
    it('should be', function(){
      // How poignant
      expect(true).toBe(true);
      // On failure, please bail out of universe
      expect(false).not.toBe(true);
    });
  });

});
