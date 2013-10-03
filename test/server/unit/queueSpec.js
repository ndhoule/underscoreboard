var Queue = require('../../../lib/queue');

describe('Queue:', function() {
  beforeEach(function() {
    this.queue = new Queue();
    this.uniqueElement = {};
  });

  it('should be a function', function() {
    expect(Queue).to.be.a('function');
  });

  it('should create an object when called', function() {
    expect(this.queue).to.be.an('object');
  });

  describe('#enqueue', function() {
    it('should add a new item to the queue', function() {
      this.queue.enqueue(this.uniqueElement);
      expect(this.queue.size()).to.equal(1);
      expect(this.queue.dequeue()).to.equal(this.uniqueElement);
    });

    it('should return the queue\'s new size when adding an element', function() {
      expect(this.queue.size()).to.equal(0);
      expect(this.queue.enqueue('test')).to.equal(1);
    });
  });

  describe('#dequeue', function() {
    it('should remove an element from the queue', function() {
      this.queue.enqueue(this.uniqueElement);

      expect(this.queue.dequeue()).to.equal(this.uniqueElement);
    });

    it('should reduce the size of the queue when removing an element', function() {
      expect(this.queue.size()).to.equal(0);

      this.queue.enqueue(this.uniqueElement);

      expect(this.queue.size()).to.equal(1);

      this.queue.dequeue();

      expect(this.queue.size()).to.equal(0);
    });

    it('should return undefined when no element was removed', function() {
      expect(this.queue.dequeue()).to.be.undefined;
    });

    it('should not decrease the size of the queue when no element was removed', function() {
      expect(this.queue.size()).to.equal(0);

      this.queue.dequeue();

      expect(this.queue.size()).to.equal(0);
    });
  });

  describe('#remove', function() {
    beforeEach(function() {
      this.queue.enqueue(true);
      this.queue.enqueue(this.uniqueElement);
      this.queue.enqueue(this.uniqueElement);
    });

    it('should remove the first instance of a specified element', function() {
      expect(this.queue.remove(this.uniqueElement)).to.equal(this.uniqueElement);

      this.queue.dequeue();

      expect(this.queue.dequeue()).to.equal(this.uniqueElement);
    });

    it('should return undefined if the given element is not found', function() {
      expect(this.queue.remove('Lolcats')).to.be.undefined;
    });

    it('should reduce the size of the queue when removing an element', function() {
      expect(this.queue.size()).to.equal(3);

      this.queue.remove(this.uniqueElement);

      expect(this.queue.size()).to.equal(2);

      this.queue.remove(true);

      expect(this.queue.size()).to.equal(1);
    });

    it('should not reduce the size of the queue if no elements were removed', function() {
      expect(this.queue.size()).to.equal(3);

      this.queue.remove('ha!');

      expect(this.queue.size()).to.equal(3);
    });
  });

  describe('#peek', function() {
    beforeEach(function() {
      this.queue.enqueue(this.uniqueElement);
      this.queue.enqueue('Nyan Cat');
      this.queue.enqueue(null);
    });

    it('should return the first item in the queue', function() {
      expect(this.queue.peek()).to.equal(this.uniqueElement);
    });

    it('should not dequeue the first item in the queue', function() {
      this.queue.peek();

      expect(this.queue.dequeue()).to.equal(this.uniqueElement);
    });

    it('should not reduce the size of the queue when called', function() {
      expect(this.queue.size()).to.equal(3);

      this.queue.peek();

      expect(this.queue.size()).to.equal(3);
    });
  });

  describe('#isEmpty', function() {
    it('should return true when the queue is empty', function() {
      expect(this.queue.size()).to.equal(0);
      expect(this.queue.isEmpty()).to.be.true;
    });

    it('should return false when the queue is not empty', function() {
      expect(this.queue.isEmpty()).to.be.true;

      this.queue.enqueue('Tobias Funke');

      expect(this.queue.isEmpty()).to.be.false;
    });
  });

  describe('#reset', function() {
    beforeEach(function() {
      this.queue.enqueue(this.uniqueElement);
      this.queue.enqueue(true);
      this.queue.enqueue(2);
    });

    it('should reset the queue\'s size to 0', function() {
      expect(this.queue.size()).to.equal(3);

      this.queue.reset();

      expect(this.queue.size()).to.equal(0);
    });

    it('should remove all elements from the queue', function() {
      expect(this.queue.peek()).to.equal(this.uniqueElement);

      this.queue.reset();

      expect(this.queue.peek()).to.be.undefined;
    });
  });

  describe('#contains', function() {
    beforeEach(function() {
      this.queue.enqueue(this.uniqueElement);
      this.queue.enqueue(2);
    });

    it('should return true if the queue contains a given element', function() {
      expect(this.queue.contains(this.uniqueElement)).to.be.true;
      expect(this.queue.contains(2)).to.be.true;
    });

    it('should return false if the queue does not contain a given element', function() {
      expect(this.queue.contains('2')).to.be.false;
      expect(this.queue.contains({})).to.be.false;
    });
  });

  describe('#size', function() {
    it('should return the current size of the queue', function() {
      expect(this.queue.size()).to.equal(0);

      this.queue.enqueue(this.uniqueElement);

      expect(this.queue.size()).to.equal(1);

      this.queue.enqueue('lolcat');

      expect(this.queue.size()).to.equal(2);

      this.queue.dequeue();

      expect(this.queue.size()).to.equal(1);

      this.queue.dequeue();

      expect(this.queue.size()).to.equal(0);
    });
  });
});
