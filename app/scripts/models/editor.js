define([
  'backbone',
  'underscore'
], function(Backbone, _) {
  'use strict';

  return Backbone.Model.extend({
    defaults: {
      theme: 'textmate',
      tabSize: 2,
      mode: 'javascript'
    },

    validate: function(attrs, x) {
      if (!_.some([attrs.player === 'player', attrs.player === 'opponent'])) {
        return [
          'An editor model needs a player attribute of either "opponent" or',
          '"player". Current value is:',
          attrs.player
        ].join(' ');
      }
    },

    initialize: function(opts) {
      if (!this.isValid()) {
        throw new Error(this.validationError);
      }

      if ((opts.player === 'opponent') && !opts.readOnly) {
        this.set('readOnly', true);
      }

      return this;
    }
  });
});
