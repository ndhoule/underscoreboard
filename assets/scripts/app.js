define([
  'backbone',
  'underscore',
  'vent',
  'modalView'
], function(Backbone, _, vent) {
  'use strict';

  return Backbone.StatefulModel.extend({
    states: {
      pairing: { enter: ['showPairingModal'], leave: ['dismissModals'] },
      repairing: { enter: ['showRepairingModal'], leave: ['dismissModals'] },
      playing: { enter: ['startRound'], leave: [] },
      transition: { enter: ['resetRoom'], leave: ['dismissModals'] }
    },

    transitions: {
      init: {
        'toState:pairing': 'pairing'
      },

      pairing: {
        'toState:playing': 'playing'
      },

      repairing: {
        'toState:playing': 'playing'
      },

      playing: {
        'toState:transition': 'transition',
        'toState:pairing': 'pairing',
        'toState:repairing': 'repairing'
      },

      transition: {
        'toState:playing': 'playing',
        'toState:pairing': 'pairing',
        'toState:repairing': 'repairing'
      }
    },

    defaults: {
      currentFunction: null
    },

    initialize: function() {
      this.models = {};
      this.views = {};
      this.routers = {};

      _.bindAll(this, 'startRound', 'receiveEditorChange', 'receiveVictory', 'resetRoom');

      // Wait until the modal has finished loading to display it
      vent.on('modal:ready', _.once(function() {
        vent.trigger('modal:pairing');
      }));

      this.on('change:currentFunction', function() {
        this.loadTests(this.get('currentFunction').name);
      }, this);

      vent.on('socket:game.start', function(currentFunction) {
        this.set('currentFunction', currentFunction);
        this.trigger('toState:playing');
      }, this);

      vent.on('socket:acknowledge', function(data) {
        this.set('userId', data.id);
      }, this);

      vent.on('socket:game.end', this.receiveVictory);

      vent.on('socket:user.part', function() {
        this.trigger('toState:repairing');
      }, this);

      vent.on('socket:editor.change', this.receiveEditorChange);

      this.on('transition', function(leaveState, enterState) {
        console.info('State transition: %s -> %s', leaveState, enterState);
      });

      this.trigger('toState:pairing');

      return this;
    },

    loadTests: (function() {
      var $testRunner = $('.test-runner');

      return function(url) {
        $testRunner.attr({
          'src': 'scripts/test_runner/SpecRunner.html?grep=_.' + url
        });
      };
    }()),

    startRound: function() {
      console.info('Starting round...');

      // Delay the start of the game by a few seconds to make the transition
      // less jarring
      setTimeout(_.bind(function() {
        this.views.player.resetEditor();
        console.info('Round started.');
      }, this), 3000);
    },

    // Triggered when an opponent disconnects.
    resetRoom: function() {
      this.set('currentFunction', null);
      this.views.player.resetEditor();
      this.views.opponent.resetEditor();

      // Invalidate test timer so we don't accidentally run tests against
      // empty editors
      clearTimeout(this.views.testRunner.updateTestsTimer);
    },

    receiveEditorChange: function(data) {
      this.views.opponent.setValue(data);
      this.views.opponent.editor.selection.clearSelection();
    },

    // userId represents the victorious user.
    receiveVictory: function(userId) {
      if (this.get('userId') === userId) {
        vent.trigger('modal:victory');
      } else {
        vent.trigger('modal:loss');
      }
      this.trigger('toState:transition');
    },

    showPairingModal: function() {
      vent.trigger('modal:pairing');
    },

    showRepairingModal: function() {
      vent.trigger('modal:repairing');
    },

    dismissModals: function() {
      setTimeout(function() {
        vent.trigger('modal:unrender');
      }, 2000);
    }
  });
});
