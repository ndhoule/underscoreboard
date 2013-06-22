/*globals module: true*/

(function(){
  'use strict';
  var path = require('path');

  module.exports = {
    nodeRequire: require,
    baseUrl: path.join(__dirname, '..'),
    paths: {
      app:       path.join('config', 'app'),
      roomModel: path.join('models', 'room'),
      routes:    path.join('routes', 'index'),
      sockets:   path.join('lib', 'sockets'),
      userModel: path.join('models', 'user')
    }
  };
}());
