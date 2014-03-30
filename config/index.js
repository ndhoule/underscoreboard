'use strict';

var _ = require('lodash');
var path = require('path');

var rootDir = path.resolve(__dirname, '..');

module.exports = function(app) {
  global.Underscoreboard = {};

  Underscoreboard.config = _.merge({
    dirs: {
      assets: path.join(rootDir, '.tmp/public'),
      routes: path.join(rootDir, 'app/routes'),
      views: path.join(rootDir, 'app/views')
    }
  }, require(path.join(__dirname, 'env', process.env.NODE_ENV + '.json')));

  Underscoreboard.log = require('./logger');

  // TODO: Use database
  //require('./db');
  require('./express')(app);
  require('./routes')(app);
};
