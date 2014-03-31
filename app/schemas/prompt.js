'use strict';

var _ = require('lodash');

module.exports = function(db) {
  return db.knex.schema.hasTable('prompt').then(function(exists) {
    if (!exists) {
      return db.knex.schema.createTable('prompt', function(prompt) {
        prompt.increments('id').primary();
        prompt.string('set', 100).index();
        prompt.string('name', 100);
        prompt.text('description');
        prompt.text('boilerplate');
        // TODO: When supported, use Postgres native arrays here
        prompt.json('aliases');
        prompt.enum('difficulty', _.range(0, 11));
        prompt.timestamps();
      });
    }
  });
};
