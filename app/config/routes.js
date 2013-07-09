var path = require('path'),
    root = require(path.join(__dirname, '..', 'routes/root'));

module.exports = function(app) {
  app.get('/', root.get);
};
