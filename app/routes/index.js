/*jshint node:true*/
'use strict';

exports.main = function(req, res) {
  res.render('main', {
    title : 'Underscoreboard',
    js    : ['js/main.min.js']
  });
};
