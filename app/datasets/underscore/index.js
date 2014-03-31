'use strict';

var Bookshelf = require('bookshelf');
var Promise = require('bluebird');
var _ = require('lodash');
var config = require('../../../config/env/development.json').db;
var fs = require('fs');
var path = require('path');

var dataDir = path.join(__dirname, 'data');
var db = Bookshelf.initialize(config);
var Prompt = db.Model.extend({
  tableName: 'prompt',
  hasTimestamps: true
});

fs.readdir(dataDir, function(err, files) {
  if (err) {
    throw err;
  }

  var promises = _.chain(files)
    .filter(function(file) {
      return (/.*\.json$/).test(file);
    })
    .map(function(file) {
      fs.readFile(path.join(dataDir, file), function(err, contents) {
        if (err) {
          throw err;
        }

        try {
          contents = JSON.parse(contents);
        } catch (e) {
          return console.warn('Failed to process file %s due to JSON parsing error.', file);
        }

        contents.aliases = JSON.stringify(contents.aliases);

        _.each(contents, function(data, key, contents) {
          if (_.isArray(data)) {
            contents[key] = data.join('\n');
          }
        });

        return Prompt.forge(contents).save()
          .then(function() {
            console.log('Imported file %s', file);
          });
      });
    })
    .value();

  Promise.all(promises)
    .catch(function(err) {
      console.warn('Error while processing files:', err);
    });
});

