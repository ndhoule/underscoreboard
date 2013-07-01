define(['chai', 'lodash', 'queue'], function(chai, _, makeQueue) {
  var expect = chai.expect;

  describe('Queue', function() {
    var queue;

    beforeEach(function() {
      queue = makeQueue();
    });

    describe('the factory and instance', function() {
      it('should be a function', function() {
        expect(makeQueue).to.be.a('function');
      });

      it('should create an object when called', function() {
        expect(queue).to.be.an('object');
      });

      it('should have a predefined set of methods', function() {
        var methods = ['enqueue', 'dequeue', 'remove', 'peek', 'isEmpty', 'reset', 'contains', 'size'];

        _.each(methods, function(method) {
          expect(queue[method]).to.be.a('function');
        });
      });
    });

  });
});
