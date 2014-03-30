define([
  'modalView',
  'vent',
  'alertify',
  'hbs!scripts/templates/modal_pairing'
], function(ModalView, vent, alertify, pairingModalTemplate) {
  'use strict';

  return ModalView.extend({
    initialize: function() {
      ModalView.prototype.initialize.apply(this, arguments);

      vent.on('modal:unrender', function() {
        this.hide();
      }, this);

      vent.on('modal:pairing', function() {
        this.model.set({
          title: 'Welcome to Underscoreboard',
          body: pairingModalTemplate()
        });
        this.show();
      }, this);

      vent.on('modal:repairing', function() {
        this.model.set({
          title: 'Your Partner Left',
          body: '<p>Finding you a new partner...</p>'
        });
        this.show();
      }, this);

      vent.on('modal:victory', function() {
        alertify.success('You won! Moving on to the next round...');
      }, this);

      vent.on('modal:loss', function() {
        alertify.error('You lost. Moving on to the next round...');
      }, this);

      // Notify the application that the modalView is ready
      vent.trigger('modal:ready');

      return this;
    }
  });
});
