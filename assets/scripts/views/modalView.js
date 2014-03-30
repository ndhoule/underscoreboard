define([
  'backbone',
  'underscore',
  'hbs!scripts/templates/modal',
  // Unnamed dependencies
  'bootstrapModal'
], function(Backbone, _, modalTemplate) {
  'use strict';

  return Backbone.View.extend({
    el: $('.modal-container').get(0),

    template: modalTemplate,

    options: {
      closeButton: true,
      backdrop: true,
      keyboard: true,
      remote: false,
      show: false
    },

    events: {
      'hidden.bs.modal': 'unrender'
    },

    initialize: function(options) {
      _.bindAll(this, 'render', 'unrender', 'show', 'hide');
      _.extend(this.options, options);

      this.model.on('change', this.render, this);

      this.options.fade ? this.$el.addClass('fade') : this.$el.removeClass('fade');
      this.render();

      return this;
    },

    render: function() {
      this.$el.html(this.template(_.extend({}, this.options, {
        model: this.model.attributes
      })));
      this.$el.modal(_.pick(this.options, ['backdrop', 'keyboard', 'remote', 'show']));

      return this;
    },

    unrender: function() {
      this.$el.data('modal', null);
      this.shown = false;
      this.remove();

      return this;
    },

    show: function() {
      this.$el.modal('show');
      this.shown = true;

      return this;
    },

    hide: function() {
      this.$el.modal('hide');
      this.shown = false;

      return this;
    }
  });
});
