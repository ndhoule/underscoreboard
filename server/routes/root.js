'use strict';

exports.get = function(req, res) {
  res.render('root', { title: 'Underscoreboard', js: [] });
};
