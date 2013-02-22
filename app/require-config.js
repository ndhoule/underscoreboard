/*jshint node:true*/
/*globals define: true*/
"use strict";

module.exports = {
  nodeRequire: require,
  paths: {
    app:       __dirname + '/app',
    sockets:   __dirname + '/sockets',
    roomModel: __dirname + '/models/room',
    userModel: __dirname + '/models/user'
  }
};
