define([
  'backbone',
  'vent',
  'underscore'
], function(Backbone, Vent, _) {
  'use strict';

  return Backbone.Model.extend({
    initialize: function() {
      this.set('currentFunction', null); // XXX

      this.vent = new Vent();

      // Show a load menu on startup
      window.setTimeout(_.bind(function() {
        this.vent.trigger('modal:pairing');
      }, this), 750);


      /*
       * Events
       */

      this.vent.on('socket:beginGame', _.bind(function(data) {
        console.info('Event fired: "socket:beginGame"');

        this.startGame(data);
      }, this));

      this.vent.on('socket:editorChange', _.bind(function(data) {
        console.info('Event fired: "socket:editorChange"');

        this.opponentView.setValue(data);

        // Fix annoying highlighting of opponent's editor when its contents
        // changes
        this.opponentView.editor.selection.clearSelection();
      }, this));


      this.vent.on('socket:victory', function() {
        // If receiving this message, that means the server has broadcasted
        // another player's victory.
        this.vent.trigger('modal:loss');
      }, this);

      this.vent.on('socket:resetRoom', _.bind(function() {
        // If the other player disconnects, display a repairing modal and
        // clean up.
        console.info('Opponent disconnected.');
        // Tell the user we're re-pairing them.
        this.vent.trigger('modal:repairing');

        // Reset state to original condition
        window.Underscoreboard.App.set('currentFunction', null);
        this.playerView.resetEditor();
        this.opponentView.resetEditor();

        // Invalidate test timer so we don't accidentally run tests against
        // empty editors
        clearTimeout(this.testRunnerView.updateTestsTimer);
      }, this));

      return this;
    },

    startGame: function(func) {
      console.info('Starting game...');

      // Make both a local and global reference to the current function
      this.set('currentFunction', func);

      // Hide the victory/loss modals if they're currently displayed
      this.vent.trigger('modal:unrender');

      // Delay the start of the game by a few seconds to make the transition
      // less jarring
      setTimeout(_.bind(function() {
        this.playerView.resetEditor();

        // TODO: Fix modals
        // modals.pairing.modal('hide');

        // Display the current function to the user and load the test URL.
        // This prevents Mocha from testing any function other than the
        // current function
        $('.test-runner').attr({
          'src': 'scripts/test_runner/SpecRunner.html?grep=_.' + func.name
        });

        console.info('Game started.');
      }, this), 3000);
    }
  });
});
