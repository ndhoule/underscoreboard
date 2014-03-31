'use strict';

var db = require('../../config/db');

module.exports = db.Model.extend({
  tableName: 'user',
  hasTimestamps: true
});
