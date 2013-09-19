var path = require('path'),
    home = require(path.join(__dirname, '..', 'routes/home'));

module.exports = function(app) {
  app.get('/', home.get);
};
