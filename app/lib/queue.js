define(function() {
  'use strict';
  // A first-in, first-out data structure.
  var queue = Object.create(null);

  /**
   * Inserts an item into the queue at the current tail index.
   *
   * @param {*} element The element to be inserted into the queue.
   * @returns {number} the number of elements contained in the queue.
   */
  queue.enqueue = function(element) {
    this._elements[this._tail++] = element;
    return this.size();
  };

  /**
   * Removes the head element from the queue and returns it.
   *
   * @returns {*} The object located at the head of the queue.
   */
  queue.dequeue = function() {
    if (this._head === this._tail) {
      return undefined;
    }
    var result = this._elements[this._head];
    delete this._elements[this._head++];
    return result;
  };

  /**
   * Removes the first instance of a given value from the queue.
   *
   * @param {*} element A value to remove from the queue.
   * @returns {*} The element if it was found, or undefined if not.
   */
  queue.remove = function(element) {
    var result,
        index = this._elements.indexOf(element);

    if (index === -1) {
      return result;
    }
    if (index === this._head) {
      result = this.dequeue();
    } else {
      result = this._elements.splice(index, 1)[0];
      this._tail--;
    }
    return result;
  };

  /**
   * Return the queue's head value without dequeueing it.
   *
   * @returns {*} The object stored at the head of the queue, or undefined if
   * the queue is empty.
   */
  queue.peek = function() {
    if (this._head === this._tail) {
      return undefined;
    }
    return this._elements[this._head];
  };

  /**
   * Determine whether or not the queue is empty.
   *
   * @returns {*} True if the queue is empty, false if it contains any
   * elements.
   */
  queue.isEmpty = function() {
    return this.size() === 0;
  };

  /**
   * Resets the queue to its original state.
   *
   * @returns {Boolean} Returns true.
   */
  queue.reset = function() {
    this._elements.length = 0;
    this._head = 0;
    this._tail = 0;
    return true;
  };

  /**
   * Return whether or not the queue contains a given element.
   *
   * @param {*} element The element to find in the queue.
   * @returns {Boolean} True if the queue contains the given element, false if
   * not.
   */
  queue.contains = function(element) {
    if (this._elements.indexOf(element) === -1) {
      return false;
    }
    return true;
  };

  /**
   * Determine the size of the queue.
   *
   * @returns {number} The current number of elements contained within the queue.
   */
  queue.size = function() {
    return this._tail - this._head;
  };

  /**
   * A factory for creating a queue.
   *
   * @returns {Object} An instance of a queue.
   */
  return function() {
    var instance = Object.create(queue, {
      _elements: {
        value: [],
        enumerable: true,
        writable: true
      },
      _head:  {
        value: 0,
        enumerable: true,
        writable: true
      },
      _tail: {
        value: 0,
        enumerable: true,
        writable: true
      }
    });
    return instance;
  };
});
