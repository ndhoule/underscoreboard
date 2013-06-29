/*global setTimeout:false, clearTimeout: false, document:false, window:false, console:false*/

// Ensure that Ace files are loaded relative to the compiled file's path
require.config({
  paths: {
    ace: 'js/lib/ace'
  }
});

require(['domReady', 'jquery', 'underscore', 'sockjs', 'editorView',  'bootstrap'], function(domReady, $, _, SockJS, EditorView) {
  'use strict';

  // Namespace for global data
  window.UNDERSCOREBOARD = Object.create(null);
  var socket = new SockJS(window.location.origin + '/echo');

  // Require's equivalent of $(document).ready()
  domReady(function() {
    var updateTestsTimer,
        messageHandler,
        tests = Object.create(null),
        editors = Object.create(null),
        modals = Object.create(null),
        childFrame = document.getElementById('tests').contentWindow;

    modals.pairing = $('#pairing-modal');
    modals.repairing = $('#repairing-modal');
    modals.victory = $('#victory-modal');
    modals.loss = $('#loss-modal');

    editors.player = new EditorView({ el: 'editor-player' });
    editors.opponent = new EditorView({ el: 'editor-opponent', readOnly: true });

    tests.update = function() {
      console.debug('Updating tests...');
      childFrame.postMessage({
        code: editors.player.aceSession.getValue(),
        currentFunction: window.UNDERSCOREBOARD.currentFunction
      }, window.location.origin);
    };

    tests.verify = function(runStats) {
      // If any of these fail, set victory to false
      var victory = !_.some([
        runStats.tests === 0,
        runStats.passes === 0,
        runStats.failures !== 0,
        runStats.tests !== runStats.passes
      ]);

      console.info('Victory status:', victory);

      if (victory) {
        modals.victory.modal('show');
        socket.send(JSON.stringify({
          type: 'victory',
          data: true
        }));
      }
    };

    // Show a load menu on startup
    setTimeout(function() {
      modals.pairing.modal('show');
    }, 750);

    // Reset the contents of the editor to the placeholder test when the reset
    // button is pressed
    $('#reset-button').click(function(e) {
      e.preventDefault();
      if (window.confirm('Are you sure you want to reset your code to the start point?')) {
        editors.player.resetEditor();
      }
    });

    var messageHandler = function(event) {
      if (event.origin !== window.location.origin) {
        return;
      }

      tests.verify(event.data);
    };


    // Listen for Mocha test results
    window.addEventListener('message', messageHandler, false);

    /* Socket events */

    socket.onmessage = function(event) {
      var message = JSON.parse(event.data);

      switch(message.type) {
        case 'beginGame':
        console.log('Starting game...');
        // Delay the start of the game by a few seconds to make the transition
        // less jarring
        setTimeout(function() {
          // Make both a local and global reference to the current function
          window.UNDERSCOREBOARD.currentFunction = message.data;

          editors.player.resetEditor();

          // Hide the victory/loss modals if they're currently displayed
          modals.victory.modal('hide');
          modals.loss.modal('hide');
          modals.repairing.modal('hide');

          // Display the current function to the user and load the test URL. This
          // prevents Mocha from testing any function other than the current function
          modals.pairing.modal('hide');
          $('#tests').attr({ 'src': '/mocha/SpecRunner.html?grep=_.' + message.data.name });
          console.log('Game started.');
        }, 3000);
        break;

        case 'editorChange':
        editors.opponent.setValue(message.data);
        // Fixes annoying highlighting of opponent's editor when its contents changes
        editors.opponent.aceSession.selection.clearSelection();
        break;

        case 'victory':
        // If receiving this message, that means the server has broadcasted a loss.
        modals.loss.modal('show');
        break;

        case 'resetRoom':
        // If the other player disconnects, display a repairing modal and clean up.
        console.info('Opponent disconnected.');
        // Tell the user we're re-pairing them.
        modals.repairing.modal('show');

        // Reset state to original condition
        window.UNDERSCOREBOARD.currentFunction = null;
        editors.player.resetEditor();
        editors.opponent.resetEditor();

        // Invalidate test timer so we don't accidentally run tests against
        // empty editors
        clearTimeout(updateTestsTimer);

        // Make sure no modals are in the way
        modals.pairing.modal('hide');
        modals.victory.modal('hide');
        modals.loss.modal('hide');
        break;

        default:
        console.warn('Unknown message received from server:', message.type);
      }
    };

    // When the contents of the player editor change, set a timer (and invalidate
    // any timers that already exist). This puts intertia behind test refreshes so
    // they don't happen too often
    editors.player.aceSession.on('change', function() {
      if (updateTestsTimer) {
        clearTimeout(updateTestsTimer);
      }
      socket.send(JSON.stringify({
        type: 'editorChange',
        data: editors.player.aceSession.getValue()
      }));
      updateTestsTimer = setTimeout(tests.update, 1200);
    });

  });
});
