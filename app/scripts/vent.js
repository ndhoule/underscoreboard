define([
  'backbone',
  'sockjs',
  'underscore'
], function(Backbone, SockJS, _) {
  'use strict';

  return function() {
    var vent = _.clone(Backbone.Events);

    vent._socket = new SockJS(window.location.origin + '/echo');

    vent._socket.onmessage = function(e) {
      var message = JSON.parse(e.data);

      vent.trigger('socket:' + message.type, message.data);
    };

    // Listen for Mocha test results
    window.addEventListener('message', function(e) {
      if (e.origin !== window.location.origin) {
        console.warn('Message received from cross-origin source:', e.origin);
        return;
      }

      vent.trigger('testRunner:message', e.data);
    }, false);

    vent.on('editor:change', function(data) {
      vent.trigger('tests:updateTimer');
      vent._socket.send(JSON.stringify({
        type: 'editorChange',
        data: data
      }));
    });

    vent.on('victory', function() {
      // XXX
      // modals.victory.modal('show');
      vent._socket.send(JSON.stringify({
        type: 'victory',
        data: true
      }));
    });

    return vent;
  };
});
