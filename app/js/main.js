/*jshint laxcomma:true*/
/*global setTimeout:false, clearTimeout: false, document:false, window:false, console:false*/

// Set require.js configuration settings. These are used mostly for compiling
// main.js into main.min.js via r.js
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

  // The contents of this file should only load once the DOM is ready, so wrap
  // them in require.js's equivalent of $(document).ready
  domReady(function() {
    var currentFunction,
        updateTestsTimer,
        verifyTestsTimer;

    var editors = {
      player: createEditor('editor-player'),
      opponent: createEditor('editor-opponent', true)
    };

    // Create a few globals so we can share values with the testing iframe.
    // Namespace them in the underscoreboardGlobals object to prevent collisions
    window.underscoreboardGlobals = {
      specFailures: null,
      playerEditor: editors.player,
      currentFunction: null
    };

    var updateTests = function() {
      document.getElementById('tests').contentDocument.location.reload(true);
    };

    // Monitor the passing specs and display a victory modal when all are passing
    var verifyTests = function() {
      if (window.underscoreboardGlobals.specFailures === 0) {
        $('#victory-modal').modal('show');
        socket.emit('sweetVictory', true);
      }
    };

    // Insert the server's placeholder text and insert it into the editor. The
    // start point for the text is always the end of the second-to-last line, so
    // move the cursor there while we're at it
    var resetEditor = function(editor) {
      editor.setValue(currentFunction.desc.join('\n') + '\n' + currentFunction.boiler.join('\n'));
      editor.selection.moveCursorBy(-1, 0);
      editor.selection.clearSelection();
    };

    // Show a load menu on startup
    setTimeout(function() {
      $('#pairing-modal').modal('show');
    }, 750);

    // Reset the contents of the editor to the placeholder test when the reset
    // button is pressed
    $('#reset-button').click(function(e) {
      e.preventDefault();
      if (window.confirm("Are you sure you want to reset your code to the start point?")) {
        resetEditor(editors.player);
      }
    });

    // Socket connections
    var socket = io.connect();

    socket.on('error', function(e) {
      console.error('Unable to create Socket.io connection. Error: ', e);
    });

    socket.on('beginGame', function(message) {
      // Delay the start of the game by a few seconds to make the transition
      // less jarring
      setTimeout(function() {
        // Make both a local and global reference to the current function
        window.underscoreboardGlobals.currentFunction = currentFunction = message;

        resetEditor(editors.player);

        // Hide the victory/loss modals if they're currently displayed
        $('#victory-modal').modal('hide');
        $('#loss-modal').modal('hide');

        // Display the current function to the user and load the test URL. This
        // prevents Mocha from testing any function other than the current function
        $('#current-function-name').html('<small>' + currentFunction.name + '</small>');
        $('#current-function-label').show();
        $('#current-function-name').show();
        $('#pairing-modal').modal('hide');
        $('#tests').attr({'src': '/mocha/SpecRunner.html?grep=_.' + currentFunction.name});
      }, 3000);
    });

    socket.on('updateEditor', function(message) {
      editors.opponent.setValue(message);
      // Fixes annoying highlighting of opponent's editor when its contents changes
      editors.opponent.selection.clearSelection();
    });

    // If receiving this message, that means the server has broadcasted a loss.
    // Display a loss modal in this case
    socket.on('sweetVictory', function(message) {
      $('#loss-modal').modal('show');
    });

    // When the contents of the player editor change, set a timer (and invalidate
    // any timers that already exist). This puts intertia behind test refreshes so
    // they don't happen too often
    editors.player.on('change', function() {
      if (updateTestsTimer) {
        clearTimeout(updateTestsTimer);
      }
      if (verifyTestsTimer) {
        clearTimeout(verifyTestsTimer);
      }

      socket.emit('editorChange', editors.player.getValue());
      updateTestsTimer = setTimeout(updateTests, 1200);
      verifyTestsTimer = setTimeout(verifyTests, 2500);
    });

  });
});
