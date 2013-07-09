/*global _: false, path: false, appDir: false*/
'use strict';

var makeQueue = require(path.join(appDir, 'lib/queue'));

describe('Queue:', function() {
  var queue, uniqueElement;

  beforeEach(function() {
    queue = makeQueue();
    uniqueElement = {};
  });

  // Meta :: Test coverage for the queue's public API
  it('should be a function', function() {
    expect(makeQueue).to.be.a('function');
  });

  it('should create an object when called', function() {
    expect(queue).to.be.an('object');
  });

  it('should have only a predefined set of methods', function() {
    var methods = ['enqueue', 'dequeue', 'remove', 'peek', 'isEmpty', 'reset', 'contains', 'size'];

    for (var key in queue) {
      // Ignore properties that aren't part of the public API
      if (key[0] !== '_') {
        expect(_.indexOf(methods, key)).to.not.equal(-1);
        expect(queue[key]).to.be.a('function');
      }
    }
  });

  // Methods :: Tests coverage for the queue's structure/API
  describe('#enqueue', function() {
    it('should add a new item to the queue', function() {
      queue.enqueue(uniqueElement);
      expect(queue.size()).to.equal(1);
      expect(queue.dequeue()).to.equal(uniqueElement);
    });

    it('should return the queue\'s new size when adding an element', function() {
      expect(queue.size()).to.equal(0);
      expect(queue.enqueue('test')).to.equal(1);
    });
  });

  describe('#dequeue', function() {
    it('should remove an element from the queue', function() {
      queue.enqueue(uniqueElement);
      expect(queue.dequeue()).to.equal(uniqueElement);
    });

    it('should reduce the size of the queue when removing an element', function() {
      expect(queue.size()).to.equal(0);
      queue.enqueue(uniqueElement);
      expect(queue.size()).to.equal(1);
      queue.dequeue();
      expect(queue.size()).to.equal(0);
    });

    it('should return undefined when no element was removed', function() {
      expect(queue.dequeue()).to.be.undefined;
    });

    it('should not decrease the size of the queue when no element was removed', function() {
      expect(queue.size()).to.equal(0);
      queue.dequeue();
      expect(queue.size()).to.equal(0);
    });
  });

  describe('#remove', function() {
    beforeEach(function() {
      queue.enqueue(true);
      queue.enqueue(uniqueElement);
      queue.enqueue(uniqueElement);
    });

    it('should remove the first instance of a specified element', function() {
      expect(queue.remove(uniqueElement)).to.equal(uniqueElement);
      queue.dequeue();
      expect(queue.dequeue()).to.equal(uniqueElement);
    });

    it('should return undefined if the given element is not found', function() {
      expect(queue.remove('Lolcats')).to.be.undefined;
    });

    it('should reduce the size of the queue when removing an element', function() {
      expect(queue.size()).to.equal(3);
      queue.remove(uniqueElement);
      expect(queue.size()).to.equal(2);
      queue.remove(true);
      expect(queue.size()).to.equal(1);
    });

    it('should not reduce the size of the queue if no elements were removed', function() {
      expect(queue.size()).to.equal(3);
      queue.remove('ha!');
      expect(queue.size()).to.equal(3);
    });
  });

  describe('#peek', function() {
    beforeEach(function() {
      queue.enqueue(uniqueElement);
      queue.enqueue('Nyan Cat');
      queue.enqueue(null);
    });

    it('should return the first item in the queue', function() {
      expect(queue.peek()).to.equal(uniqueElement);
    });

    it('should not dequeue the first item in the queue', function() {
      queue.peek();
      expect(queue.dequeue()).to.equal(uniqueElement);
    });

    it('should not reduce the size of the queue when called', function() {
      expect(queue.size()).to.equal(3);
      queue.peek();
      expect(queue.size()).to.equal(3);
    });
  });

  describe('#isEmpty', function() {
    it('should return true when the queue is empty', function() {
      expect(queue.size()).to.equal(0);
      expect(queue.isEmpty()).to.be.true;
    });

    it('should return false when the queue is not empty', function() {
      expect(queue.isEmpty()).to.be.true;
      queue.enqueue('Tobias Funke');
      expect(queue.isEmpty()).to.be.false;
    });
  });

  describe('#reset', function() {
    beforeEach(function() {
      queue.enqueue(uniqueElement);
      queue.enqueue(true);
      queue.enqueue(2);
    });

    it('should reset the queue\'s size to 0', function() {
      expect(queue.size()).to.equal(3);
      queue.reset();
      expect(queue.size()).to.equal(0);
    });

    it('should remove all elements from the queue', function() {
      expect(queue.peek()).to.equal(uniqueElement);
      queue.reset();
      expect(queue.peek()).to.be.undefined;
    });
  });

  describe('#contains', function() {
    beforeEach(function() {
      queue.enqueue(uniqueElement);
      queue.enqueue(2);
    });

    it('should return true if the queue contains a given element', function() {
      expect(queue.contains(uniqueElement)).to.be.true;
      expect(queue.contains(2)).to.be.true;
    });

    it('should return false if the queue does not contain a given element', function() {
      expect(queue.contains('2')).to.be.false;
      expect(queue.contains({})).to.be.false;
    });
  });

  describe('#size', function() {
    it('should return the current size of the queue', function() {
      expect(queue.size()).to.equal(0);
      queue.enqueue(uniqueElement);
      expect(queue.size()).to.equal(1);
      queue.enqueue('lolcat');
      expect(queue.size()).to.equal(2);
      queue.dequeue();
      expect(queue.size()).to.equal(1);
      queue.dequeue();
      expect(queue.size()).to.equal(0);
    });
  });

});
