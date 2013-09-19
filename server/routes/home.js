'use strict';

exports.get = function(req, res) {
  res.render('home', {
    helpers: {
      dat: function() { return process.env.NODE_ENV; }
    }
  });
};
