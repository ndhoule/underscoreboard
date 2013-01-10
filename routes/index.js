// var mongoose = require('mongoose'),
    // Editor   = mongoose.model('Editor');

exports.index = function(req, res){
  res.render('index', { title: 'Underscoreboard.js' });
};
exports.code = function(req, res){
  console.log(req.params);
  res.end();
};
