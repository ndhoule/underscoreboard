'use strict';

var fs = require('fs');
var path = require('path');

var rIsJs = /.*\.js$/;

module.exports = function(app) {
  var routesDir = Underscoreboard.config.dirs.routes;

  fs.readdirSync(routesDir).filter(rIsJs.test.bind(rIsJs)).forEach(function(filename) {
    var filepath = path.join(routesDir, filename);

    Underscoreboard.log.debug('Loading route: %s', filepath);
    require(filepath)(app);
  });
};
