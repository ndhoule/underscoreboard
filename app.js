/*jshint node:true, laxcomma:true, expr:true*/
"use strict";

var requirejs = require('requirejs');
requirejs.config({nodeRequire: require});

requirejs(['http', 'path', 'express', './routes', 'socket.io', './public/functions.json'], function (http, path, express, routes, socketio, underscoreFns) {
  var app = express()
    , server = http.createServer(app)
    , io = socketio.listen(server, {origins: '*:*', log: false});

  app.configure(function() {
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));
  });

  app.get('/', routes.index);


  // Room prototype
  var Room = {
    init: function(){
      if (this._initialized) {
        throw new Error("Cannot initialize a previously initialized room.");
      }
      var result = Object.create(Room);
      result._initialized = true;
      result.players = result.observers = [];
      return result;
    },

    isFull: function(){
      return this.players.length >= 2;
    },

    addUser: function(user){
      if (this.isFull()) {
        throw new Error("Cannot add users to a full room.");
      }
      return this.players.push(user);
    },

    getUsers: function(){
      return this.players;
    },

    getObservers: function(){
      return this.observers;
    }
  };

  // Player factory
  var createUser = function(client){
    return {client: client};
  };


  // Create a room when we initialize the server
  var currentRoom = Room.init();
  // Create a container to hold full rooms
  var prevRooms = [];

  io.sockets.on('connection', function (client) {
    var user = createUser(client);

    if( currentRoom.isFull() ){
      prevRooms.push(currentRoom);
      currentRoom = Room.init();
    }

    currentRoom.addUser(user);

    client.on('editorChange', function(message) {
      client.broadcast.emit('updateEditor', message);
    });

    client.on('disconnect',function(){
      console.log('lol bai');
    });
  });

  server.listen(app.get('port'), function() {
    console.log("Underscoreboard server listening on port " + app.get('port'));
  });

});
