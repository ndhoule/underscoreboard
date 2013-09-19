'use strict';

var express = require('express'),
    handlebars = require('express3-handlebars'),
    path = require('path');

module.exports = function(app) {
  var hbs,
      appDir = path.join(__dirname, '..'),
      viewsDir = path.join(appDir, 'views');

  hbs = handlebars.create({
    layoutsDir: path.join(viewsDir, 'layouts'),
    partialsDir: path.join(viewsDir, 'partials'),
    defaultLayout: 'main',
    extname: '.hbs',
    helpers: require(path.join(viewsDir, 'helpers', 'global'))
  });

  // Get around limitation of handlebars package, which doesn't call helpers
  // within conditionals
  app.set('isProduction', process.env.NODE_ENV === 'production');

  app.set('port', process.env.PORT || 5000);
  app.set('views', path.join(appDir, '/views'));
  app.engine('hbs', hbs.engine);
  app.set('view engine', 'hbs');
  app.use(express.compress());
  app.use(express.favicon());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.logger());

  if (app.get('env') === 'development') {
    app.use(express.logger('dev'));
    app.use(express.static(path.join(appDir, '..', '.tmp')));
    app.use(express.static(path.join(appDir, '..', 'app')));
  }

  if (app.get('env') === 'production') {
    app.use(express.static(path.join(appDir, 'public')));
  }
};
