define([
  'backbone'
], function(Backbone) {
  'use strict';

  return Backbone.Model.extend({
    defaults: {
      readOnly: 'true',
      theme: 'textmate',
      tabSize: 2,
      mode: 'javascript'
    },

    validate: function(attrs) {
      if (!attrs.player) {
        return 'All editor models need a player attribute.';
      }
    },

    initialize: function() {
      if (!this.isValid()) {
        throw new Error(this.validationError);
      }

      return this;
    }
  });
});
