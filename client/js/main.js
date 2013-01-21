/*jshint laxcomma:true*/
/*global 'ace':false, 'io':false, 'setTimeout':false, 'document':false, 'window':false, 'console':false*/

require.config({
  paths: {
    ace         : '/js/lib/ace'
  , io          : '/socket.io/socket.io'
  , domReady    : '/js/lib/domReady'
  , createEditor: '/js/createEditor'
  }
});


require(['domReady', 'jquery', 'createEditor', 'io'], function(domReady, $, createEditor, io) {
  "use strict";
  domReady(function() {
    var updateCount = 0;

    var update = function(){
      if (--updateCount === 0) {
        document.getElementById('tests').contentDocument.location.reload(true);
      }
    };

    var editors = {};
    editors.p = createEditor('editor-p');
    editors.o = createEditor('editor-o', true);

    // Declare a global to make the player's editor available to the jasmine iframe.
    // TODO: Make this less ugly, maybe by passing this information through sockets.
    // TODO: Make editor naming scheme more consistent across files
    window.xeditor1 = editors.p;


    // Event listeners
    $('#skip-button').click(function(e) {
      e.preventDefault();
      console.log('skip this round button clicked');
    });

    $('#reset-button').click(function(e) {
      e.preventDefault();
      console.log('reset editor area button clicked');
    });

    $('#login-button').click(function(e) {
      e.preventDefault();
      console.log('log in button clicked');
    });

    // Socket connections
    var socket = io.connect();

    socket.on('error', function(e){
      console.error('Unable to create Socket.io connection. Error: ', e);
    });

    socket.on('connect', function(){
      console.info('Socket.io connection established');
    });

    // TODO: security hole: client could broadcast this event to anyone connected
    socket.on('beginGame', function(message){
      setTimeout(function(){
        editors.p.setValue(message.desc.join('\n') + '\n' + message.boiler.join('\n'));
      }, 2500);
    });

    socket.on('updateEditor', function(message){
      editors.o.setValue(message);
    });

    editors.p.on('change', function(){
      updateCount++;
      socket.emit('editorChange', editors.p.getValue());
      setTimeout(update, 1200);
    });

  });
});
