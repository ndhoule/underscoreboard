define([
  'backbone',
  'underscore',
  'vent'
], function(Backbone, _, vent) {
  'use strict';

  return Backbone.View.extend({
    initialize: function() {
      _.bindAll(this, 'verify', 'update');

      this.updateTestsTimer = null;

      vent.on('testRunner:message', this.verify);

      vent.on('tests:updateTimer', this.update);
    },

    _verifyResults: function(results) {
      // If any of these fail, set victory to false
      return !_.some([
        results.tests === 0,
        results.passes === 0,
        results.failures !== 0,
        results.tests !== results.passes
      ]);
    },

    verify: _.debounce(function(results) {
      if (Underscoreboard.currentState === 'playing') {
        if (this._verifyResults(results)) {
          vent.trigger('victory');
        }
      }
    }, 750, true),

    update: _.debounce(function() {
      this.el.contentWindow.postMessage({
        code: Underscoreboard.views.player.editor.getValue(),
        // XXX
        currentFunction: Underscoreboard.get('currentFunction')
      }, location.origin);
    }, 1500)
  });
});
