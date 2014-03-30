'use strict';

var controller = require('../controllers/home');

module.exports = function(app) {
  app.get('/', controller.read);
};
