'use strict';

var _ = require('lodash');
var path = require('path');

var rootDir = path.resolve(__dirname, '..');

module.exports = function(app) {
  var envConfig = require(path.join(__dirname, 'env', process.env.NODE_ENV + '.json'));

  var defaultConfig = {
    dirs: {
      assets: path.join(rootDir, '.tmp/public'),
      routes: path.join(rootDir, 'app/routes'),
      views: path.join(rootDir, 'app/views'),
      schemas: path.join(rootDir, 'app/schemas')
    },
    log: {
      console: {
        level: 'info',
        timestamp: true,
        colorize: false
      },

      exitOnError: false
    }
  };

  var config = _.merge(defaultConfig, envConfig);

  global.Underscoreboard = {
    config: config,
    log: require('./logger')(config.log)
  };

  return require('./db')(config.db)
    .then(function(db) {
      Underscoreboard.db = db;

      return require('./express')(app);
    })
    .then(function() {
      return require('./routes')(app);
    })
    .catch(function(err) {
      Underscoreboard.log.emerg('Configuration phase failed with error: %s', err.stack);
      throw err;
    });
};
