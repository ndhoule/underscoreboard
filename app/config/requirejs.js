(function() {
  'use strict';

  var path = require('path');

  module.exports = {
    nodeRequire: require,
    baseUrl: path.join(__dirname, '..'),
    paths: {
      app:             path.join('config', 'app'),
      queue:           path.join('lib', 'queue'),
      roomModel:       path.join('models', 'room'),
      routes:          path.join('routes', 'index'),
      sockjs_handlers: path.join('lib', 'sockjs_handlers'),
      sockjs_server:   path.join('config', 'sockjs_server'),
      userModel:       path.join('models', 'user')
    }
  };
}).call(this);
