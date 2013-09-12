'use strict';

var express = require('express'),
    path = require('path');

module.exports = function(app) {
  var appDir = path.join(__dirname, '..');

  app.configure(function() {
    app.set('port', process.env.PORT || 5000);
    app.set('views', path.join(appDir, '/views'));
    app.set('view engine', 'jade');
    app.use(express.compress());
    app.use(express.favicon());
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.logger());
  });

  app.configure('development', function() {
    app.use(express.logger('dev'));
    app.use(express.static(path.join(appDir, '..', '.tmp')));
    app.use(express.static(path.join(appDir, '..', 'app')));
  });

  app.configure('production', function() {
    app.use(express.static(path.join(appDir, 'public')));
  });
};
