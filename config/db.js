'use strict';

var _ = require('lodash');
var Bookshelf = require('bookshelf');
var Promise = require('bluebird');
var fs = require('fs');
var path = require('path');

var rIsJs = /.*\.js$/;

module.exports = function(config) {
  var db = Bookshelf.initialize(config);

  return Promise.promisify(fs.readdir)(Underscoreboard.config.dirs.schemas)
    .then(function(filenames) {
      return _.filter(filenames, _.bind(rIsJs.test, rIsJs));
    })
    .then(function(filenames) {
      return _.map(filenames, function(filename) {
        var filepath = path.join(Underscoreboard.config.dirs.schemas, filename);

        Underscoreboard.log.debug('Loading schema file: %s', filepath);
        return require(filepath)(db);
      });
    }).then(function() {
      return db;
    });
};
