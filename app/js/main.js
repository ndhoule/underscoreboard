/*jshint laxcomma:true*/
/*global 'setTimeout':false, 'document':false, 'window':false, 'console':false*/

require.config({
  paths: {
    ace         : '/js/lib/ace'
  , io          : '/socket.io/socket.io'
  , domReady    : '/js/lib/domReady'
  , bootstrap   : '/js/lib/bootstrap.min'
  , createEditor: '/js/createEditor'
  },
  shim: {
    'bootstrap' : ['jquery']
  }
});


require(['domReady', 'jquery', 'io', 'createEditor', 'bootstrap'], function(domReady, $, io, createEditor) {
  "use strict";
  domReady(function() {
    var currentFn,
        updateCount = 0;

    var updateTests = function() {
      if (--updateCount === 0) {
        document.getElementById('tests').contentDocument.location.reload(true);
      }
    };

    var verifyTests = function() {
      if (window.xfailures === 0) {
        $('#victory-modal').modal('show');
        socket.emit('sweetVictory', true);
      }
    };

    var editors = {};
    editors.p = createEditor('editor-p');
    editors.o = createEditor('editor-o', true);

    // Declare a global to make the player's editor available to the testing iframe.
    window.xeditor1 = editors.p;

    // Show loading menu on pageload
    setTimeout(function() {
      $('#pairing-modal').modal('show');
    }, 750);

    // Event listeners
    $('#skip-button').click(function(e) {
      //TODO: Implement this
      e.preventDefault();
      console.log('skip this round button clicked');
    });

    $('#reset-button').click(function(e) {
      e.preventDefault();
      if (window.confirm("Are you sure you want to reset your code to the start point?")) {
        //TODO: dry
        editors.p.setValue(currentFn.desc.join('\n') + '\n' + currentFn.boiler.join('\n'));
      }
    });

    $('#login-button').click(function(e) {
      //TODO: Implement this
      e.preventDefault();
      console.log('log in button clicked');
    });

    // Socket connections
    var socket = io.connect();

    socket.on('error', function(e) {
      console.error('Unable to create Socket.io connection. Error: ', e);
    });

    socket.on('connect', function() {
      console.info('Socket.io connection established');
    });

    socket.on('beginGame', function(message) {
      setTimeout(function() {
        // Make both a local and global reference to the current function
        window.xcurrentFn = currentFn = message;

        // Insert the placeholder text into editor and move cursor to the start point
        editors.p.setValue(currentFn.desc.join('\n') + '\n' + currentFn.boiler.join('\n'));
        editors.p.selection.moveCursorBy(-1, 0);
        editors.p.selection.clearSelection();

        // Display the current function to the user and load the test URL
        $('#current-function-name').html('<small>' + currentFn.name + '</small>');
        $('#current-function-label').toggle();
        $('#current-function-name').toggle();
        $('#pairing-modal').modal('hide');
        $('#tests').attr({'src': '/mocha/SpecRunner.html?grep=_.' + currentFn.name});
      }, 3000);
    });

    socket.on('updateEditor', function(message) {
      editors.o.setValue(message);
      // Fixes annoying highlighting of opponent's editor when its contents changes
      editors.o.selection.clearSelection();
    });

    socket.on('sweetVictory', function(message) {
      $('#loss-modal').modal('show');
    });

    editors.p.on('change', function() {
      updateCount++;
      socket.emit('editorChange', editors.p.getValue());
      setTimeout(updateTests, 1200);
      setTimeout(verifyTests, 2500);
    });

  });
});
