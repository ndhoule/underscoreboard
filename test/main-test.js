var Utils = {};

// Shallow extend. Copies the properties of another object(s) to a target object.
Utils.extend = function(obj) {
  Array.prototype.slice.call(arguments, 1).forEach(function(object) {
    Object.keys(object).forEach(function(key) {
      obj[key] = object[key];
    });
  });
  return obj;
};

// Turns an array of filenames into an object of filename: filepath pairs
// compatible with Require.js. Filters the input array using a specified regex.
Utils.filerizer = function(regex, array) {
  return Object.keys(array)
         .filter(function(file) { return new RegExp(regex).test(file); })
         .map(function(file) {
           var s = file.split('/').pop();
           return [
             s.substr(0, s.lastIndexOf('.')),
             file.replace(/(\.js)|(\/base\/)/g, '')
           ]
         }).reduce(function(memo, value) {
           if (value[0] && value[1]) {
             memo[value[0]] = value[1];
           }
           return memo;
         }, {});
};

// An array containing specfile paths.
var tests = Object.keys(window.__karma__.files).filter(function(file) {
  return /Spec\.js$/.test(file);
});

// A list of paths to be required by Require.js.
var paths = {
  libraries: {
    chai: 'node_modules/chai/chai',
    lodash: 'node_modules/lodash/lodash'
  },
  app: Utils.filerizer('\\/base\\/assets\\/', window.__karma__.files),
  assets: Utils.filerizer('\\/base\\/app\\/', window.__karma__.files)
};

requirejs.config({
  // Karma serves files from '/base'
  baseUrl: '/base',

  paths: Utils.extend({}, paths.libraries, paths.app, paths.assets),

  // ask Require.js to load these files (all our tests)
  deps: tests,

  // start test run, once Require.js is done
  callback: window.__karma__.start
});
