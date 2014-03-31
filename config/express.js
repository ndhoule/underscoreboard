'use strict';

var Promise = require('bluebird');
var express = require('express');
var handlebars = require('express3-handlebars');
var path = require('path');

module.exports = function(app) {
  var hbs = handlebars.create({
    layoutsDir: path.join(Underscoreboard.config.dirs.views, 'layouts'),
    partialsDir: path.join(Underscoreboard.config.dirs.views, 'partials'),
    defaultLayout: 'main',
    extname: '.hbs',
    helpers: require(path.join(Underscoreboard.config.dirs.views, 'helpers/global'))
  });

  app.set('port', process.env.PORT || Underscoreboard.config.port || 6789);
  app.set('views', path.join(Underscoreboard.config.dirs.views));
  app.engine('hbs', hbs.engine);
  app.set('view engine', 'hbs');
  app.use(express.compress());
  app.use(express.favicon(path.join(Underscoreboard.config.dirs.assets, 'favicon.ico')));
  app.use(express.json());
  app.use(express.urlencoded());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(Underscoreboard.config.dirs.assets));

  return Promise.resolve(app);
};
