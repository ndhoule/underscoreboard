'use strict';

var express = require('express'),
    path = require('path');

module.exports = function(app) {
  app.configure(function() {
    var appDir = path.join(__dirname, '..');
    app.set('port', process.env.PORT || 5000);
    app.set('views', path.join(appDir, '/views'));
    app.set('view engine', 'jade');
    app.use(express.compress());
    app.use(express.favicon());
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(path.join(appDir, '/public')));
    app.use(express.logger());
  });

  app.configure('development', function() {
    app.use(express.logger('dev'));
  });
};
