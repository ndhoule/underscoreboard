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


require(['domReady', 'io', 'createEditor'], function(domReady, io, createEditor) {
  "use strict";
  domReady(function () {

    var updateCount = 0;

    var update = function(){
      if (--updateCount === 0) {
        document.getElementById('editor1-tests').contentDocument.location.reload(true);
      }
    };

    var editors = {};
    editors.p = createEditor('editor1');
    editors.o = createEditor('editor2', true);

    // Declare a global to make the player's editor available to the jasmine iframe.
    // TODO: Make this less ugly, maybe by passing this information through sockets.
    // TODO: Make editor naming scheme more consistent across files
    window.xeditor1 = editors.p;

    var socket = io.connect();

    socket.on('error', function(e){
      console.error('Unable to create Socket.io connection. Error: ', e);
    });

    socket.on('connect', function(){
      console.info('Socket.io connection established');
    });

    socket.on('replaceEditor', function(message){
      editors.o.setValue(message);
    });

    editors.p.on("change", function(){
      updateCount++;
      socket.emit('editorContents', editors.p.getValue());
      setTimeout(update, 1200);
    });

  });
});
