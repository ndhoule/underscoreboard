define([
  'backbone',
  'underscore'
], function(Backbone, _) {
  return Backbone.View.extend({
    initialize: function() {
      var vent = window.Underscoreboard.App.vent;

      _.bindAll(this, 'update');

      this.updateTestsTimer = null;

      vent.on('testRunner:message', _.bind(function(data) {
        console.info('Event fired: "testRunner:message"');

        this.verify(data) && (vent.trigger('modal:victory') && vent.trigger('victory'));
      }, this));

      // XXX
      // When the contents of the player editor change, set a timer (and
      // invalidate any timers that already exist). This puts intertia behind
      // test refreshes so they don't happen too often
      vent.on('tests:updateTimer', _.bind(function() {
        if (this.updateTestsTimer) {
          clearTimeout(this.updateTestsTimer);
        }
        this.updateTestsTimer = setTimeout(this.update, 1200);
      }, this));
    },

    verify: function(runStats) {
      // If any of these fail, set victory to false
      return !_.some([
        runStats.tests === 0,
        runStats.passes === 0,
        runStats.failures !== 0,
        runStats.tests !== runStats.passes
      ]);
    },

    // XXX
    update: function() {
      this.el.contentWindow.postMessage({
        // XXX
        code: window.Underscoreboard.App.playerView.editor.getValue(),
        currentFunction: window.Underscoreboard.App.get('currentFunction')
      }, window.location.origin);
    }
  });
});
