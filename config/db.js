'use strict';

var Bookshelf = require('bookshelf');

module.exports = Bookshelf.initialize(Underscoreboard.config.db);
