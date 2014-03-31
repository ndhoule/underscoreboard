'use strict';

module.exports = function(db) {
  return db.knex.schema.hasTable('user').then(function(exists) {
    if (!exists) {
      return db.knex.schema.createTable('user', function(prompt) {
        prompt.increments('id').primary();
        prompt.string('username', 25);
        prompt.string('password', 100);
        prompt.timestamps();
      });
    }
  });
};
