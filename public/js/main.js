/*global "ace":false, "io":false*/

(function(){
  "use strict";

  // Generate uid
  var uid = Math.random();
  // Instantiate both editor sessions
  var editor1 = ace.edit("editor1");
  editor1.setTheme("ace/theme/monokai");
  editor1.getSession().setMode("ace/mode/javascript");
  var editor2 = ace.edit("editor2");
  editor2.setTheme("ace/theme/monokai");
  editor2.getSession().setMode("ace/mode/javascript");
  editor2.setReadOnly(true);

  // Lay down dat socket.io connection
  var socket = io.connect();

  socket.on('error', function (e){
    console.error('Unable to create Socket.io connection. Error: ', e);
  });

  socket.on('connect', function (){
    console.info('Socket.io connection established');
  });

  socket.on('replaceEditor', function(message){
    editor2.setValue(message);
  });

  editor1.on("change", function(){
    socket.emit('editorContents', editor1.getValue());
  });
})();
