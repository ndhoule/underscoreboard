define(['chai', 'lodash', 'queue'], function(chai, _, makeQueue) {
  var expect = chai.expect;

  describe('Queue', function() {
    var queue;

    beforeEach(function() {
      queue = makeQueue();
    });

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

    describe('enqueue', function() {
      it('should add a new item to the queue', function() {
        var element = {};

        queue.enqueue(element);
        expect(queue.size()).to.equal(1);
        expect(queue.dequeue()).to.equal(element);
      });

      it('should return the queue\'s new size when adding an element', function() {
        expect(queue.size()).to.equal(0);
        expect(queue.enqueue('test')).to.equal(1);
      });
    });

    describe('dequeue', function() {
      it('should _____', function() {
      });
    });

    describe('remove', function() {
      it('should _____', function() {
      });
    });

    describe('peek', function() {
      it('should _____', function() {
      });
    });

    describe('isEmpty', function() {
      it('should _____', function() {
      });
    });

    describe('reset', function() {
      it('should _____', function() {
      });
    });

    describe('contains', function() {
      it('should _____', function() {
      });
    });

    describe('size', function() {
      it('should _____', function() {
      });
    });

  });
});
