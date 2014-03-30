'use strict';

var sockjsMultiplex = require('websocket-multiplex');
var sockjs = require('sockjs');

exports.server = sockjs.createServer();
exports.multiplexer = new sockjsMultiplex.MultiplexServer(exports.server);
