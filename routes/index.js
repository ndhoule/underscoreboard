/*jshint laxcomma:true, node:true, es5:true */
"use strict";


exports.index = function(req, res){
  res.render('index', { title: 'Underscoreboard.js', description: 'A simple, outcode-your-friends game', author: 'Nathan Houle' });
};

exports.code = function(message){
  console.log(JSON.stringify(message));
};

