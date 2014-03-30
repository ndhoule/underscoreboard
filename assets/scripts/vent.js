define([
  'backbone',
  'underscore',
  'sockjs',
  'backbone.statemachine'
], function(Backbone, _, SockJS) {
  'use strict';

  var Vent = Backbone.Model.extend({
    initialize: function() {
      _.bindAll(this, 'sendEditorContents', 'socketEvent', 'victory', 'mochaEvent');

      this.trigger = _.wrap(this.trigger, function(func /*, args */) {
        console.info('%cVent event triggered:', 'color: red', arguments[1]);
        func.apply(this, _.rest(arguments));
      });

      // Only start accepting socket events when the application has finished
      // loaded
      this.on('ready', function() {
        this._socket = new SockJS(window.location.origin + '/echo');
        this._socket.onmessage = this.socketEvent;
      }, this);

      this.on('editor:change', this.sendEditorContents);

      this.on('victory', this.victory);

      window.addEventListener('message', this.mochaEvent, false);
    },

    // Transmit socket events under the `socket:` namespace
    socketEvent: function(e) {
      var message = JSON.parse(e.data);

      this.trigger('socket:' + message.type, message.data);
    },

    // Sends a player's editor changes back to the server
    sendEditorContents: function(data) {
      this.trigger('tests:updateTimer');
      this._socket.send(JSON.stringify({
        type: 'editor.change',
        data: data
      }));
    },

    // Sends a victory signal back to the server
    victory: function() {
      this._socket.send(JSON.stringify({
        type: 'game.victory',
        data: true
      }));
    },

    // Bind a listener to the Mocha test iframe
    mochaEvent: function(e) {
      if (e.origin !== window.location.origin) {
        console.warn('Message received from cross-origin source:', e.origin);
        return;
      }

      this.trigger('testRunner:message', e.data);
    }
  });

  return new Vent();
});
