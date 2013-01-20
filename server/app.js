/*jshint node:true, laxcomma:true, expr:true*/
"use strict";

var requirejs = require('requirejs');
requirejs.config({nodeRequire: require});

requirejs(['http', 'path', 'express', './routes', 'socket.io', 'underscore', './functions.json'], function (http, path, express, routes, socketio, _, underscoreFns) {
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
    app.use(express.static(path.join(__dirname, '../client')));
  });

  app.get('/', routes.index);


  // Room prototype
  var Room = function(){
      var result = Object.create(Room);
      result.players = result.observers = [];
      return _.extend(result, Room.methods);
  };

  Room.methods = {
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
  var currentRoom = Room();
  // Create a container to hold full rooms
  var prevRooms = [];

  io.sockets.on('connection', function (client) {
    var user = createUser(client);

    if( currentRoom.isFull() ){
      prevRooms.push(currentRoom);
      currentRoom = Room();
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
