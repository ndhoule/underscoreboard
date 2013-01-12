(function() {
  
  // Call iterator(value, key, obj) for each element of obj
  var each = function(obj, iterator) {
    if(Array.isArray(obj)) {
      for(var i = 0; i < obj.length; i++){
        iterator(obj[i], i, obj)
      }
    } else {
      for(var i in obj) {
        if(obj.hasOwnProperty(i)){
          iterator(obj[i], i, obj);
        }
      }
    }
  };

  // Determine if the array or object contains a given value (using `===`).
  var contains = function(obj, target) {
    var itExists = false;
    _.each(obj, function(i){
      if(i === target){
        itExists = true;
      }
    })
    return itExists;
  };

  // Return the results of applying an iterator to each element.
  var map = function(array, iterator) {
    var resultArray = [];
    _.each(array, function (value) {resultArray.push(iterator(value))});
    return resultArray;
  };

  // Takes an array of objects and returns an array of the values of
  // a certain property in it. E.g. take an array of people and return
  // an array of just their ages
  var pluck = function(array, property) {
    return _.map(array, function(value, key) {
      return value[property];
    });
  };

  // Return an array of the last n elements of an array. If n is 1, return
  // just the last element
  var last = function(array, n) {
    if(array === null){
      return undefined;
    }
    return _.select(array, function(value, key){
      return key >= (n === undefined ? array.length -1 : array.length - n ) ? true : false
    });
  };

  // Like last, but for the first elements
  var first = function(array, n) {
    if(array === null){
      return undefined;
    }
    return _.select(array, function(value, key){
      return key < (n === undefined ? 1 : n ) ? true : false
    });
  };

  // Reduces an array or object to a single value by repetitively calling
  // iterator(previousValue, item) for each item. previousValue should be
  // the return value of the previous iterator call.
  // 
  // You can pass in an initialValue that is passed to the first iterator
  // call. Defaults to 0.
  //
  // Example:
  //   var numbers = [1,2,3];
  //   var sum = _.reduce(numbers, function(previous_value, item){
  //     return previous_value + item;
  //   }, 0); // should be 6
  //
  var reduce = function(obj, iterator, initialValue) {
    var returnValue = (initialValue === undefined ? 0 : initialValue);
    _.each(obj, function(value) {
      returnValue = iterator(returnValue, value);
    })
    return returnValue;
  };

  // Return all elements of an array that pass a truth test.
  var select = function(array, iterator) {
    var resultsArray = [];
    _.each(array, function(value, key, obj){
      if(iterator(value, key, obj)){
        resultsArray.push(value);
      }
    });
    return resultsArray;
  };

  // Return all elements of an array that don't pass a truth test.
  var reject = function(array, iterator) {
    return _.select(array, function(value, key){
      return !(iterator(value, key));
    });
  };

  // Determine whether all of the elements match a truth test.
  var every = function(obj, iterator) {
    var result = true;
    _.each(obj, function(value){
        iteratorResult = iterator(value);
        if(!iteratorResult){
          result = false;
        }
    });
    return result;
  };

  // Determine whether any of the elements pass a truth test.
  var any = function(obj, iterator) {
    var result = false;
    _.each(obj, function(value){
        iteratorResult = (iterator === undefined ? value : iterator(value));
        if(iteratorResult){
          result = true;
        }
    });
    return result;
  };

  // Produce a duplicate-free version of the array.
  var uniq = function(array) {
    var resultArray = [];
    _.each(array, function(value){
      if(!(_.contains(resultArray, value)) ){
        resultArray.push(value);
      }
    });
    return resultArray;
  };

  // Return a function that can be called at most one time. Subsequent calls
  // should return the previously returned value.
  var once = function(func) {
    func();
    func = function() {};
    return func;
  };

  // Memoize an expensive function by storing its results. You may assume
  // that the function takes only one argument and that it is a primitive.
  //
  // Memoize should return a function that when called, will check if it has
  // already computed the result for the given argument and return that value
  // instead if possible.
  var memoize = function(func) {
    var keyPair={};
    return function(n){
      if(!keyPair.hasOwnProperty(n)) {
        keyPair[n] = func(n);
      }
      return keyPair[n];
    };
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  //
  // The arguments for the original function are passed after the wait
  // parameter. For example _.delay(someFunction, 500, 'a', 'b') will
  // call someFunction('a', 'b') after 500ms
  var delay = function(func, wait) {
    var Array_prototype_slice = Array.prototype.slice;
    var relevantArgs = Array_prototype_slice.call(arguments, 2);
    setTimeout(function() {func(relevantArgs)}, wait);
  };

  // Extend a given object with all the properties of the passed in 
  // object(s).
  //
  // Example:
  //   var obj1 = {key1: "something"};
  //   _.extend(obj1, {
  //     key2: "something new",
  //     key3: "something else new"
  //   }, {
  //     bla: "even more stuff"
  //   }); // obj1 now contains key1, key2, key3 and bla
  //
  var extend = function(obj) {
    var returnObj = obj;
    _.each(arguments, function (value){
      for(key in value){    
        returnObj[key] = value[key];
      }
    });
    return returnObj;
  };

  // Like extend, but doesn't ever overwrite a key that already
  // exists in obj
  var defaults = function(obj) {
  var returnObj = obj;
    _.each(arguments, function (value){
      for(key in value){
        if(returnObj[key] === undefined) {
          returnObj[key] = value[key];
        }
      }
    });
    return returnObj;
  };

  // Flattens a multidimensional array to a one-dimensional array that
  // contains all the elements of all the nested arrays.
  //
  // Hints: Use Array.isArray to check if something is an array
  //
  var flatten = function(nestedArray, result) { 
    var returnBucket=[];
    var flattenRecursion = function(anArray){
      _.each(anArray, function(item){
        if(Array.isArray(item)){
          flattenRecursion(item);
        } else {
          returnBucket.push(item);
        }
      });
    }
    flattenRecursion(nestedArray);
    return returnBucket;
  };
  // Sort the object's values by a criterion produced by an iterator.
  // If iterator is a string, sort objects by that property with the name
  // of that string. For example, _.sortBy(people, 'name') should sort
  // an array of people by their name.
  var sortBy = function(sourceArray, iterator) {
    if(typeof(iterator)==="function"){
      sourceArray.sort(function (a,b){
        return iterator(a) > iterator(b) ? 1 : -1;
      });
    } else {
      sourceArray.sort(function (a,b){
        return a[iterator] > b[iterator] ? 1 : -1;
      });
    }
    return sourceArray;
  };

  // Zip together two or more arrays with elements of the same index 
  // going together.
  // 
  // Example:
  // _.zip(['a','b','c','d'], [1,2,3]) returns [['a',1], ['b',2], ['c',3]]
  var zip = function() {
    var resultArray = [];
    var argsArray = _.map(arguments, function(n){return n});
    var longest = _.sortBy(argsArray, "length")[arguments.length -1].length;
    for(var k = 0; k < longest; k++){
      for(var i = 0; i<arguments.length; i++){
          resultArray.push((arguments[i][k]));
      }
    }
    return resultArray;
  };

  this._ = {
    each: each,
    contains: contains,
    map: map,
    pluck: pluck,
    last: last,
    first: first,
    reduce: reduce,
    select: select,
    reject: reject,
    every: every,
    any: any,
    uniq: uniq,
    once: once,
    memoize: memoize,
    delay: delay,
    extend: extend,
    defaults: defaults,
    flatten: flatten,
    sortBy: sortBy,
    zip: zip,
  };


}).call(this);
