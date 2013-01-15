/*global 'ace':false, 'io':false, 'setTimeout':false, 'document':false, 'window':false, 'console':false*/

require.config({
  paths: {
    ace: '/js/lib/ace',
    io : '/socket.io/socket.io.js'
  }
});

require(['jquery', 'io', 'ace/ace'], function($, io, ace) {
  "use strict";

  var createEditor = function(div, editable){
    var editor = ace.edit(div);
    if (editable !== true) {
      editor.setReadOnly(true);
    }
    editor.setTheme("ace/theme/monokai");
    editor.getSession().setMode("ace/mode/javascript");
    editor.getSession().setTabSize(2);
    return editor;
  };

  var updateCount = 0;

  var update = function(){
    if (--updateCount === 0) {
      document.getElementById('editor1-tests').contentDocument.location.reload(true);
    }
  };


  /* CONSUMPTION CODE */
  // Instantiate editor sessions
  var editor1 = createEditor('editor1', true);
  var editor2 = createEditor('editor2');
  window.xeditor1 = editor1;

  // Lay down dat socket.io connection
  var socket = io.connect();

  socket.on('error', function(e){
    console.error('Unable to create Socket.io connection. Error: ', e);
  });

  socket.on('connect', function(){
    console.info('Socket.io connection established');
  });

  socket.on('replaceEditor', function(message){
    editor2.setValue(message);
  });

  editor1.on("change", function(){
    updateCount++;
    socket.emit('editorContents', editor1.getValue());
    setTimeout(update, 1200);
  });
});
