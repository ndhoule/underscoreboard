'use strict';

var Promise = require('bluebird');
var _ = require('lodash');
var fs = require('fs');
var path = require('path');

module.exports = function(app) {
  var rIsJs = /.*\.js$/;
  var routesDir = Underscoreboard.config.dirs.routes;

  return Promise.promisify(fs.readdir)(routesDir)
    .then(function(filenames) {
      return _.filter(filenames, _.bind(rIsJs.test, rIsJs));
    }).then(function(filenames) {
      return _.map(filenames, function(filename) {
        var filepath = path.join(routesDir, filename);

        Underscoreboard.log.debug('Loading route file: %s', filepath);
        return require(filepath)(app);
      });
    });
};
