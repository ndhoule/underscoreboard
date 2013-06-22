/*globals define: true*/

(function(){
  'use strict';

  define(['path', 'module', 'express'], function (path, module, express) {
    var app = express();

    app.configure(function() {
      var pwd = path.dirname(path.join(module.uri, '..'));
      app.set('port', process.env.PORT || 5000);
      app.set('views', path.join(pwd, '/views'));
      app.set('view engine', 'jade');
      app.use(express.compress());
      app.use(express.favicon());
      app.use(express.bodyParser());
      app.use(express.methodOverride());
      app.use(app.router);
      app.use(express.static(path.join(pwd, '/public')));
      app.use(express.logger());
    });

    app.configure('development', function() {
      app.use(express.logger('dev'));
    });

    return app;
  });
}());
