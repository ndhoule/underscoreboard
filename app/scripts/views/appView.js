/*global Underscoreboard*/

define([
  'underscore',
  'backbone',
  'sockjs',
  'editor',
  'editors',
  'editorView',
  'navbar'
], function(_, Backbone, SockJS, Editor, Editors, EditorView, Navbar) {
  'use strict';

  return Backbone.View.extend({
    initialize: function() {
      var that = this; // XXX

      this._socket = new SockJS(window.location.origin + '/echo');

      /*
       * Editors
       */

      this.editors = new Editors([
        new Editor({ player: 'player' }),
        new Editor({ player: 'opponent' })
      ]);


      this.playerView = new EditorView({
        model: that.editors.findWhere({ player: 'player' }),
        el: _.first(document.getElementsByClassName('editor-player'))
      });

      this.opponentView = new EditorView({
        model: that.editors.findWhere({ player: 'opponent' }),
        el: _.first(document.getElementsByClassName('editor-opponent'))
      });


      this.currentFunction = null; // XXX
      var modals = Object.create(null); // XXX
      var tests = Object.create(null); // XXX
      var childFrame = _.first(document.getElementsByClassName('test-runner')).contentWindow; // XXX

      modals.pairing = $('#pairing-modal');
      modals.repairing = $('#repairing-modal');
      modals.victory = $('#victory-modal');
      modals.loss = $('#loss-modal');

      // Show a load menu on startup
      window.setTimeout(function() {
        modals.pairing.modal('show');
      }, 750);

      // XXX
      tests.update = function() {
        console.debug('Updating tests...');
        childFrame.postMessage({
          code: that.playerView.editor.getValue(),
          currentFunction: that.currentFunction
        }, window.location.origin);
      };

      // XXX
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
          this._that._socket.send(JSON.stringify({
            type: 'victory',
            data: true
          }));
        }
      };


      this.navbar = new Navbar({
        el: _.first(document.getElementsByClassName('nav'))
      });

      /*
       * Eventing
       */

      this.vent = _.clone(Backbone.Events);

      /*
       * Socket message types:
       *   beginGame
       *   editorChange
       *   victory
       *   resetRoom
       */

      this._socket.onmessage = _.bind(function(event) {
        var message = JSON.parse(event.data);

        this.vent.trigger('socket:' + message.type, message.data);


        /* Socket events */
        // XXX
        switch(message.type) {
          case 'beginGame':
          console.log('Starting game...');
          // Delay the start of the game by a few seconds to make the transition
          // less jarring
          setTimeout(function() {
            // Make both a local and global reference to the current function
            that.currentFunction = message.data;

            that.playerView.resetEditor();

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
          that.opponentView.setValue(message.data);
          // Fixes annoying highlighting of opponent's editor when its contents
          // changes
          that.opponentView.editor.selection.clearSelection();
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
          window.Underscoreboard.App.currentFunction = null;
          that.playerView.resetEditor();
          that.opponentView.resetEditor();

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
        // End XXX

      }, this);

      // XXX
      var messageHandler = function(e) {
        if (e.origin !== window.location.origin) {
          return;
        }

        tests.verify(e.data);
      };

      // Listen for Mocha test results
      window.addEventListener('message', messageHandler, false);


      // XXX
      // When the contents of the player editor change, set a timer (and
      // invalidate any timers that already exist). This puts intertia behind
      // test refreshes so they don't happen too often
      var updateTestsTimer;
      debugger;
      this.playerView.editor.on('change', function() {
        if (updateTestsTimer) {
          clearTimeout(updateTestsTimer);
        }
        that._socket.send(JSON.stringify({
          type: 'editorChange',
          data: that.playerView.editor.getValue()
        }));
        updateTestsTimer = setTimeout(tests.update, 1200);
      });
      // End XXX




      return this;
    }
  });
});
