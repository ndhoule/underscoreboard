var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var Editor = new Schema({
    user_id    : String,
    editor     : String,
    updated_at : Date
});

mongoose.model('Editor', Editor);

mongoose.connect('mongodb://localhost/express-todo');

exports.Editor = Editor;
