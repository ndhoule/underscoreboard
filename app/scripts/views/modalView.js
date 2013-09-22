define([
  'backbone',
  'underscore',
  'hbs!template/modal_loss',
  'hbs!template/modal_pairing',
  'hbs!template/modal_repairing',
  'hbs!template/modal_victory',
  'bootstrapModal'
], function(Backbone, _, lossModalTempl, pairingModalTempl, repairingModalTempl, victoryModalTempl) {
  'use strict';


  return Backbone.View.extend({
    el: _.first(document.getElementsByClassName('modalView')),

    initialize: function() {
      _.bindAll(this, 'render', 'unrender');

      this.$modalBody = this.$el.find('div.modal-content');

      this.modalBody = this.$modalBody.get(0);

      window.Underscoreboard.App.vent.on('modal:unrender', function() {
        console.info('Event fired: "modal:unrender"');

        (this.$el.css('display') !== 'none') && this.unrender();
      }, this);

      window.Underscoreboard.App.vent.on('modal:loss', function() {
        console.info('Event fired: "modal:loss"');

        if (this.$el.css('display') === 'none') {
          this.render(lossModalTempl);
        } else {
          this.unrender(_.bind(function() {
            this.render(lossModalTempl);
          }, this));
        }
      }, this);

      window.Underscoreboard.App.vent.on('modal:pairing', function() {
        console.info('Event fired: "modal:pairing"');

        if (this.$el.css('display') === 'none') {
          this.render(pairingModalTempl);
        } else {
          this.unrender(_.bind(function() {
            this.render(pairingModalTempl);
          }, this));
        }
      }, this);

      window.Underscoreboard.App.vent.on('modal:repairing', function() {
        console.info('Event fired: "modal:repairing"');

        if (this.$el.css('display') === 'none') {
          this.render(repairingModalTempl);
        } else {
          this.unrender(_.bind(function() {
            this.render(repairingModalTempl);
          }, this));
        }
      }, this);

      window.Underscoreboard.App.vent.on('modal:victory', function() {
        console.info('Event fired: "modal:victory"');

        if (this.$el.css('display') === 'none') {
          this.render(victoryModalTempl);
        } else {
          this.unrender(_.bind(function() {
            this.render(victoryModalTempl);
          }, this));
        }
      }, this);

      return this;
    },

    unrender: function(cb) {
      this.$el.modal('hide').on('hidden.bs.modal', _.bind(function() {
        this.$modalBody.html('');
        _.isFunction(cb) && cb();
      }, this));

      return this;
    },

    render: function(template) {
      this.$modalBody.html(template());
      this.$el.modal('show');

      return this;
    }
  });
});
