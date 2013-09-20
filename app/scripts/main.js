/*global setTimeout, clearTimeout, document, window, console*/

require.config({
  paths: {
    // Third-party libraries
    ace: '../bower_components/ace/lib/ace',
    backbone: '../bower_components/backbone/backbone',
    domReady: '../bower_components/requirejs-domReady/domReady',
    jquery: '../bower_components/jquery/jquery',
    underscore: '../bower_components/lodash/dist/lodash.underscore',
    sockjs: '//cdnjs.cloudflare.com/ajax/libs/sockjs-client/0.3.4/sockjs.min',
    bootstrapAffix: '../bower_components/sass-bootstrap/js/affix',
    bootstrapAlert: '../bower_components/sass-bootstrap/js/alert',
    bootstrapButton: '../bower_components/sass-bootstrap/js/button',
    bootstrapCarousel: '../bower_components/sass-bootstrap/js/carousel',
    bootstrapCollapse: '../bower_components/sass-bootstrap/js/collapse',
    bootstrapDropdown: '../bower_components/sass-bootstrap/js/dropdown',
    bootstrapModal: '../bower_components/sass-bootstrap/js/modal',
    bootstrapPopover: '../bower_components/sass-bootstrap/js/popover',
    bootstrapScrollspy: '../bower_components/sass-bootstrap/js/scrollspy',
    bootstrapTab: '../bower_components/sass-bootstrap/js/tab',
    bootstrapTooltip: '../bower_components/sass-bootstrap/js/tooltip',
    bootstrapTransition: '../bower_components/sass-bootstrap/js/transition',

    // User libraries
    underscoreUtils: 'lib/underscore.utils',

    // Views
    editorView: 'views/editorView',

    // Models
    editor: 'models/editor',

    // Collections
    editors: 'collections/editors'
  },

  shim: {
    backbone: {
      deps: ['jquery', 'underscore'],
      exports: 'Backbone'
    },
    bootstrapAffix: {
      deps: ['jquery']
    },
    bootstrapAlert: {
      deps: ['jquery']
    },
    bootstrapButton: {
      deps: ['jquery']
    },
    bootstrapCarousel: {
      deps: ['jquery']
    },
    bootstrapCollapse: {
      deps: ['jquery']
    },
    bootstrapDropdown: {
      deps: ['jquery']
    },
    bootstrapModal: {
      deps: ['jquery', 'bootstrapTransition']
    },
    bootstrapPopover: {
      deps: ['jquery']
    },
    bootstrapScrollspy: {
      deps: ['jquery']
    },
    bootstrapTab: {
      deps: ['jquery']
    },
    bootstrapTooltip: {
      deps: ['jquery']
    },
    bootstrapTransition: {
      deps: ['jquery']
    },
    underscoreUtils: {
      deps: ['underscore']
    }
  }
});


require([
  'domReady',
  'jquery',
  'underscore',
  'sockjs',
  'editor',
  'editors',
  'editorView',
  'bootstrapModal'
], function(domReady, $, _, SockJS, Editor, Editors, EditorView) {
  'use strict';

  var socket = new SockJS(window.location.origin + '/echo');

  window.UNDERSCOREBOARD = Object.create(null);

  domReady(function() {
    var updateTestsTimer, messageHandler, editors, playerView, opponentView,
        tests = Object.create(null),
        modals = Object.create(null),
        childFrame = _.first($('.test-runner')).contentWindow;

    editors = new Editors([
      new Editor({ player: 'player' }),
      new Editor({ player: 'opponent' })
    ]);

    playerView = new EditorView({
      model: _.first(editors.where({ player: 'player' })),
      el: _.first($('.editor-player'))
    });

    opponentView = new EditorView({
      model: _.first(editors.where({ player: 'opponent' })),
      el: _.first($('.editor-player'))
    });

    modals.pairing = $('#pairing-modal');
    modals.repairing = $('#repairing-modal');
    modals.victory = $('#victory-modal');
    modals.loss = $('#loss-modal');

    tests.update = function() {
      console.debug('Updating tests...');
      childFrame.postMessage({
        code: editors.player.editor.getValue(),
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

    messageHandler = function(event) {
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

          // Display the current function to the user and load the test URL.
          // This prevents Mocha from testing any function other than the
          // current function
          modals.pairing.modal('hide');
          $('.test-runner').attr({ 'src': 'scripts/test_runner/SpecRunner.html?grep=_.' + message.data.name });
          console.log('Game started.');
        }, 3000);
        break;

      case 'editorChange':
        editors.opponent.setValue(message.data);
        // Fixes annoying highlighting of opponent's editor when its contents
        // changes
        editors.opponent.editor.selection.clearSelection();
        break;

      case 'victory':
        // If receiving this message, that means the server has broadcasted a
        // loss.
        modals.loss.modal('show');
        break;

      case 'resetRoom':
        // If the other player disconnects, display a repairing modal and clean
        // up.
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

    // When the contents of the player editor change, set a timer (and
    // invalidate any timers that already exist). This puts intertia behind test
    // refreshes so they don't happen too often
    editors.player.editor.on('change', function() {
      if (updateTestsTimer) {
        clearTimeout(updateTestsTimer);
      }
      socket.send(JSON.stringify({
        type: 'editorChange',
        data: editors.player.editor.getValue()
      }));
      updateTestsTimer = setTimeout(tests.update, 1200);
    });

  });
});
