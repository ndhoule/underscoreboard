/* Based on qunit tests written by
 * Jonas Huckstein <https://github.com/jonashuckestein/>
 */


describe("each", function() {
  it("should provide value and iteration count", function() {
    _.each([1, 2, 3], function(num, i) {
      expect(num).toEqual(i + 1);
    });
  });

  it("should iterate over objects, ignoring the object prototype", function() {
    var answers = [];
    var obj = {one : 1, two : 2, three : 3};
    obj.constructor.prototype.four = 4;
    _.each(obj, function(value, key){ answers.push(key); });
    expect(answers.join(", ")).toEqual('one, two, three');
  });


  it("should be able to reference the original collection from inside the iterator", function() {
    var answer = null;
    _.each([1, 2, 3], function(num, index, arr){ if (arr.indexOf(num)>0) answer = true; });
    expect(answer).toBe(true);
  });

  it("should handle a null value gracefully", function() {
    var answers = 0;
    _.each(null, function(){ ++answers; });
    expect(answers).toEqual(0);
  });
});

describe("contains", function() {
  it("should return true if a collection contains a user-specified value", function() {
    expect(_.contains([1,2,3], 2)).toEqual(true);
    expect(_.contains({moe:1, larry:3, curly:9}, 3)).toEqual(true);
  });

  it("should return false if a collection does not contain a user-specified value", function() {
    expect(_.contains([1,3,9], 2)).toEqual(false);
  });
});

describe("map", function() {
  it("should apply a function to every value in an array", function() {
    var doubled = _.map([1, 2, 3], function(num){ return num * 2; });
    expect(doubled.join(', ')).toEqual('2, 4, 6');
  });

  it("should handle a null value gracefully", function() {
    var ifnull = _.map(null, function(){});
    expect(Array.isArray(ifnull)).toBe(true);
    expect(ifnull.length).toEqual(0);
  });
});

describe("pluck", function() {
  it("should return values contained at a user-defined property", function() {
    var people = [{name : 'moe', age : 30}, {name : 'curly', age : 50}];
    expect(_.pluck(people, 'name').join(', ')).toEqual('moe, curly');
  });
});


describe("last", function() {
  it("should pull the last element from an array", function() {
    expect(_.last([1,2,3])).toEqual(3);
  });
  it("should handle a user-defined index", function() {
    expect(_.last([1,2,3], 0).join(', ')).toEqual('');
  });
  it("should be able to ", function() {
    expect(_.last([1,2,3], 2).join(', ')).toEqual('2, 3');
  });
  it("should be able to pull the last element from an array", function() {
    expect(_.last([1,2,3], 5).join(', ')).toEqual('1, 2, 3');
  });
  it("should work on an arguments object", function() {
    var result = (function(){ return _.last(arguments, 2); })(1, 2, 3, 4);
    expect(result.join(', ')).toEqual('3, 4');
  });
  it("should work well with _.map", function() {
    var result = _.map([[1,2,3],[1,2,3]], _.last);
    expect(result.join(', ')).toEqual('3, 3');
  });
  it("handle a null value gracefully", function() {
    expect(_.last(null)).toEqual(undefined);
  });
});


describe("first", function() {
  it("should be able to pull out the first element of an array", function() {
    expect(_.first([1,2,3])).toEqual(1);
  });
  it("should be able to accept a user-defined index", function() {
    expect(_.first([1,2,3], 0).join(', ')).toEqual('');
    expect(_.first([1,2,3], 2).join(', ')).toEqual('1, 2');
    expect(_.first([1,2,3], 5).join(', ')).toEqual('1, 2, 3');
  });
  it("should work on an arguments object", function() {
    var result = (function(){ return _.first(arguments, 2); })(4, 3, 2, 1);
    expect(result.join(', ')).toEqual('4, 3');
  });
  it("should work well with _.map", function() {
    var result = _.map([[1,2,3],[1,2,3]], _.first);
    expect(result.join(', ')).toEqual('1, 1');
  });
  it("should handle a null value gracefully", function() {
    expect(_.first(null)).toEqual(undefined);
  });
});

describe("reduce", function() {
  it("should be able to sum up an array", function() {
    var sum = _.reduce([1, 2, 3], function(sum, num){ return sum + num; }, 0);
    expect(sum).toEqual(6);
  });
  it("should handle a null value gracefully (as long as the user provides an initial value)", function() {
    var sum = _.reduce([1, 2, 3], function(sum, num){ return sum + num; });
    expect(sum).toEqual(6);
  });
  it("should handle a null value gracefully (as long as the user provides an initial value)", function() {
    expect(_.reduce(null, function(){}, 138)).toEqual(138);
  });
});

describe("select", function() {
  it("should select each even number in an array", function() {
    var evens = _.select([1, 2, 3, 4, 5, 6], function(num){ return num % 2 === 0; });
    expect(evens.join(', ')).toEqual('2, 4, 6');
  });
  it("should select each odd number in an array", function() {
    var odds = _.select([1, 2, 3, 4, 5, 6], function(num){ return num % 2 !== 0; });
    expect(odds.join(', ')).toEqual('1, 3, 5');
  });
});

describe("reject", function() {
  it("should reject all even numbers", function() {
    var odds = _.reject([1, 2, 3, 4, 5, 6], function(num){ return num % 2 === 0; });
    expect(odds.join(', ')).toEqual('1, 3, 5');
  });
  it("should return all odd numbers", function() {
    var evens = _.reject([1, 2, 3, 4, 5, 6], function(num){ return num % 2 !== 0; });
    expect(evens.join(', ')).toEqual('2, 4, 6');
  });
});

describe("every", function() {
  it("should handle an empty set", function() {
    expect( _.every([], function(i){return i;}) ).toEqual(true);
  });
  it("should handle a set that contains only true values", function() {
    expect( _.every([true, true, true], function(i){return i;}) ).toEqual(true);
  });
  it("should handle a set that contains one false value", function() {
    expect( _.every([true, false, true], function(i){return i;}) ).toEqual(false);
  });
  it("should handle a set that contains even numbers", function() {
    expect( _.every([0, 10, 28], function(num){ return num % 2 === 0; }) ).toEqual(true);
  });
  it("should handle a set that contains an odd number", function() {
    expect( _.every([0, 11, 28], function(num){ return num % 2 === 0; }) ).toEqual(false);
  });
  it("should cast to boolean true", function() {
    expect( _.every([1], function(i){return i;}) ).toEqual(true);
  });
  it("should cast to boolean false", function() {
    expect( _.every([0], function(i){return i;}) ).toEqual(false);
  });
  it("should work with an array that contains several undefined values", function() {
    expect( _.every([undefined, undefined, undefined], function(i){return i;}) ).toEqual(false);
  });
});

describe("any", function() {
  var nativeSome;
  beforeEach(function(){
    nativeSome = Array.prototype.some;
    Array.prototype.some = null;
  });
  afterEach(function(){
    Array.prototype.some = nativeSome;
  });

  it("should handle the empty set", function() {
    expect(_.any([])).toEqual(false);
  });

  it("should handle a set containing 'false' values", function() {
    expect(_.any([false, false, false])).toEqual(false);
  });

  it("should handle a set containing one 'true' value", function() {
    expect(_.any([false, false, true])).toEqual(true);
  });

  it("should handle a set containing a string", function() {
    expect(_.any([null, 0, 'yes', false])).toEqual(true);
  });

  it("should handle a set that contains falsy values", function() {
    expect(_.any([null, 0, '', false])).toEqual(false);
  });

  it("should handle a set that contains all odd numbers", function() {
    expect(_.any([1, 11, 29], function(num){ return num % 2 === 0; })).toEqual(false);
  });

  it("should handle a set that contains an even number", function() {
    expect(_.any([1, 10, 29], function(num){ return num % 2 === 0; })).toEqual(true);
  });

  it("should handle casting to boolean - true", function() {
    expect(_.any([1], function(i){return i;})).toEqual(true);
  });

  it("should handle casting to boolean - false", function() {
    expect(_.any([0], function(i){return i;})).toEqual(false);
  });
});

describe("uniq", function() {
  // TODO: clarify this -- "should return a list of unique values? consolidate
  // repeated values?"
  it("should return all unique values of an unsorted array", function() {
    var list = [1, 2, 1, 3, 1, 4];
    expect(_.uniq(list).join(', ')).toEqual('1, 2, 3, 4');
  });

  it("should handle iterators that work with a sorted array", function() {
    var iterator = function(value) { return value +1; };
    var list = [1, 2, 2, 3, 4, 4];
    expect(_.uniq(list, true, iterator).join(', ')).toEqual('1, 2, 3, 4');
  });

  it("should work on an arguments object", function() {
    var result = (function(){ return _.uniq(arguments); })(1, 2, 1, 3, 1, 4);
    expect(result.join(', ')).toEqual('1, 2, 3, 4');
  });
});

describe("once", function() {
  it("should only run a user-defined function if it hasn't been run before", function() {
    var num = 0;
    var increment = _.once(function(){ num++; });
    increment();
    increment();

    expect(num).toEqual(1);
  });
});

describe("memoize", function() {
  // TODO: rewrite to be more clear
  it("a memoized version of fibonacci produces identical results", function() {
    var fib = function(n) {
      return n < 2 ? n : fib(n - 1) + fib(n - 2);
    };
    var fastFib = _.memoize(fib);
    expect(fib(10)).toEqual(55);
    expect(fastFib(10)).toEqual(55);
  });

  it("should check hasOwnProperty", function() {
    var o = function(str) {
      return str;
    };
    var fastO = _.memoize(o);
    expect(o('toString')).toEqual('toString');
    expect(fastO('toString')).toEqual('toString');
  });
});

xdescribe("delay", function() {
  // TODO: rewrite test descriptions to be more clear
  // TODO: This currently tests whether or not a function gets fired after some
  // amount of time, but it doesn't test whether it is NOT fired before that time.
  // Figure this out in another 'it' block.
  var flag, testArgs;
  it("should only execute the function after the specified wait time", function() {
    runs(function() {
      flag = false;
      testArgs = false;

      _.delay(
        function(newVal){
          flag = true;
          testArgs = newVal;
        }, 50, true);
    });
    waitsFor(function() {
      return flag;
    }, "The function should have been executed by now", 100);

    // TODO: equivalent qunit code for above todo
    //setTimeout(function(){ ok(!delayed, "didn't delay the function quite yet"); }, 50);
    //setTimeout(function(){ ok(delayed, 'delayed the function'); start(); }, 150);
    //setTimeout(function(){ ok(testArgs, "function arguments are passed in successfully"); }, 150);
  });
  it("should have successfully passed function arguments in", function() {
    expect(testArgs).toEqual(true);
  });
});

describe("extend", function() {
  var result;
  afterEach(function(){
    result = null;
  });

  it("should extend an object with the attributes of another", function() {
    expect(_.extend({}, {a:'b'}).a).toEqual('b');
  });
  it("should override properties found on the destination", function() {
    expect(_.extend({a:'x'}, {a:'b'}).a).toEqual('b');
  });
  it("should not override properties not found in the source", function() {
    expect(_.extend({x:'x'}, {a:'b'}).x).toEqual('x');
  });
  it("should extend from multiple source objects", function() {
    result = _.extend({x:'x'}, {a:'a'}, {b:'b'});
    expect(result.x == 'x' && result.a == 'a' && result.b == 'b').toBe(true);
  });
  it("in the case of a conflict, it should use the last property's values when extending from multiple source objects", function() {
    result = _.extend({x:'x'}, {a:'a', x:2}, {a:'b'});
    expect(result.x == 2 && result.a == 'b').toBe(true);
  });
  it("should not copy undefined values", function() {
    result = _.extend({}, {a: void 0, b: null});
    expect(result.hasOwnProperty('a') && result.hasOwnProperty('b')).toBe(true);
  });
});

describe("defaults", function() {
  var result, options;
  beforeEach(function(){
    options = {zero: 0, one: 1, empty: "", nan: NaN, string: "string"};
    _.defaults(options, {zero: 1, one: 10, twenty: 20}, {empty: "full"}, {nan: "nan"}, {word: "word"}, {word: "dog"});
  });
  it("should apply a value when one doesn't already exist on the target", function() {
    expect(options.zero).toEqual(0);
    expect(options.one).toEqual(1);
    expect(options.twenty).toEqual(20);
  });
  it("should not apply a value if one already exist on the target", function() {
    expect(options.empty).toEqual("");
    expect(isNaN(options.nan)).toEqual(true);
  });
  it("if two identical values are passed in, the first one wins", function() {
    expect(options.word).toEqual("word");
  });
});

describe("flatten", function() {
  it("can flatten nested arrays", function() {
    var nestedArray = [1, [2], [3, [[[4]]]]];
    expect(JSON.stringify(_.flatten(nestedArray))).toEqual('[1,2,3,4]');
  });
  it("works on an arguments object", function() {
    var result = (function(){ return _.flatten(arguments); })(1, [2], [3, [[[4]]]]);
    expect(JSON.stringify(result)).toEqual('[1,2,3,4]');
  });
});

describe("sortBy", function() {
  it("should sort by age", function() {
    var people = [{name : 'curly', age : 50}, {name : 'moe', age : 30}];
    people = _.sortBy(people, function(person){ return person.age; });
    expect(_.pluck(people, 'name').join(', ')).toEqual('moe, curly');
  });
  it("should handle undefined values", function() {
    var list = [undefined, 4, 1, undefined, 3, 2];
    expect(_.sortBy(list, function(i){return i;}).join(',')).toEqual('1,2,3,4,,');
  });
  it("should sort by length", function() {
    var list = ["one", "two", "three", "four", "five"];
    var sorted = _.sortBy(list, 'length');
    expect(sorted.join(' ')).toEqual('one two four five three');
  });
  // TODO: What the hell does 'stable' mean? Improve description here
  it("should be stable", function() {
    function Pair(x, y) {
      this.x = x;
      this.y = y;
    }
    var collection = [
      new Pair(1, 1), new Pair(1, 2),
      new Pair(1, 3), new Pair(1, 4),
      new Pair(1, 5), new Pair(1, 6),
      new Pair(2, 1), new Pair(2, 2),
      new Pair(2, 3), new Pair(2, 4),
      new Pair(2, 5), new Pair(2, 6),
      new Pair(undefined, 1), new Pair(undefined, 2),
      new Pair(undefined, 3), new Pair(undefined, 4),
      new Pair(undefined, 5), new Pair(undefined, 6)
    ];
    var actual = _.sortBy(collection, function(pair) {
      return pair.x;
    });
    expect(actual).toEqual(collection);
  });
});

describe("zip", function() {
  it("should zip together arrays of different lengths", function() {
    var names = ['moe', 'larry', 'curly'], ages = [30, 40, 50], leaders = [true];
    var stooges = _.zip(names, ages, leaders);
    expect(String(stooges)).toEqual('moe,30,true,larry,40,,curly,50,');
  });
});

