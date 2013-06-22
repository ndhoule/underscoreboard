(function(){
  define(function() {
    var routes = {};

    routes.main = function(req, res) {
      res.render('main', {
        title : 'Underscoreboard',
        js    : ['js/main.min.js']
      });
    };

    return routes;
  });
}());
