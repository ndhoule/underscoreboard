define(function() {
  'use strict';

  var routes = Object.create(null);

  routes.main = function(req, res) {
    res.render('main', {
      title : 'Underscoreboard',
      js    : ['js/main.min.js']
    });
  };

  return routes;
});
