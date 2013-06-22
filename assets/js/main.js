/*global setTimeout:false, clearTimeout: false, document:false, window:false, console:false*/

// Ensures that Ace files get loaded relative to the compiled main.min.js path
require.config({ paths:{ ace:'js/lib/ace' } });

require(['domReady', 'jquery', 'io', 'editorView', 'bootstrap'], function(domReady, $, io, EditorView) {
  'use strict';

  // Establish a socket connection right away
  var socket = io.connect();

  // The contents of this file should only load once the DOM is ready, so wrap
  // them in require.js's equivalent of $(document).ready
  domReady(function() {
    var updateTestsTimer;

    var editors = {
      player: new EditorView({el: 'editor-player'}),
      opponent: new EditorView({el: 'editor-opponent', readOnly: true})
    };

    // Create a few globals so we can share values with the testing iframe.
    // Namespace them in the underscoreboardGlobals object to prevent collisions
    window.underscoreboardGlobals = {
      specFailures: null,
      playerEditor: editors.player.aceSession,
      currentFunction: null
    };

    var updateTests = function() {
      document.getElementById('tests').contentDocument.location.reload(true);
      setTimeout(verifyTests, 1000);
    };

    // Monitor the passing specs and display a victory modal when all are passing
    var verifyTests = function() {
      if (window.underscoreboardGlobals.specFailures === 0) {
        $('#victory-modal').modal('show');
        socket.emit('victory');
      }
    };

    // Show a load menu on startup
    setTimeout(function() {
      $('#pairing-modal').modal('show');
    }, 750);

    // Reset the contents of the editor to the placeholder test when the reset
    // button is pressed
    $('#reset-button').click(function(e) {
      e.preventDefault();
      if (window.confirm('Are you sure you want to reset your code to the start point?')) {
        editors.player.resetEditor();
      }
    });


    /* Socket events */

    socket.on('error', function(e) {
      console.error('Unable to create Socket.io connection. Error: ', e);
    });

    socket.on('beginGame', function(message) {
      // Delay the start of the game by a few seconds to make the transition
      // less jarring
      setTimeout(function() {
        // Make both a local and global reference to the current function
        window.underscoreboardGlobals.currentFunction = message;

        editors.player.resetEditor();

        // Hide the victory/loss modals if they're currently displayed
        $('#victory-modal').modal('hide');
        $('#loss-modal').modal('hide');
        $('#repairing-modal').modal('hide');

        // Display the current function to the user and load the test URL. This
        // prevents Mocha from testing any function other than the current function
        $('#pairing-modal').modal('hide');
        $('#tests').attr({'src': '/mocha/SpecRunner.html?grep=_.' + message.name});
      }, 3000);
    });

    socket.on('updateEditor', function(message) {
      editors.opponent.setValue(message);
      // Fixes annoying highlighting of opponent's editor when its contents changes
      editors.opponent.aceSession.selection.clearSelection();
    });

    // If receiving this message, that means the server has broadcasted a loss.
    // Display a loss modal in this case
    socket.on('victory', function() {
      $('#loss-modal').modal('show');
    });

    // If the other player disconnects, display a repairing modal and clean up.
    socket.on('resetRoom', function() {
      console.info('Opponent disconnected.');
      // Tell the user we're re-pairing them.
      $('#repairing-modal').modal('show');

      // Do cleanup to reset state to original condition
      window.underscoreboardGlobals.currentFunction = null;
      editors.player.resetEditor();
      editors.opponent.resetEditor();

      // Important: Invalidate test timer so we don't accidentally run tests
      // against empty editors
      clearTimeout(updateTestsTimer);

      // Make sure no modals are in the way
      $('#pairing-modal').modal('hide');
      $('#victory-modal').modal('hide');
      $('#loss-modal').modal('hide');
    });


    // When the contents of the player editor change, set a timer (and invalidate
    // any timers that already exist). This puts intertia behind test refreshes so
    // they don't happen too often
    editors.player.aceSession.on('change', function() {
      if (updateTestsTimer) {
        clearTimeout(updateTestsTimer);
      }

      socket.emit('editorChange', editors.player.aceSession.getValue());
      updateTestsTimer = setTimeout(updateTests, 1200);
    });

  });
});
