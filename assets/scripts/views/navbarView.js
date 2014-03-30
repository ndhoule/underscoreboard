/*jshint scripturl: true*/

define([
  'backbone',
  'underscore',
  'hbs!scripts/templates/navbarItem'
], function(Backbone, _, navbarItemTemplate) {
  'use strict';

  return Backbone.View.extend({
    links: [
      {
        text: 'Reset Code',
        href: 'javascript:void(0)',
        className: 'resetEditor'
      }
    ],

    events: {
      'click a.resetEditor': function(e) {
        e.preventDefault();
        if (window.confirm('Are you sure you want to reset your code to the start point?')) {
          Underscoreboard.views.player.resetEditor();
        }
      }
    },

    initialize: function() {
      this.render();

      return this;
    },

    render: function() {
      this.$el.empty();

      _.each(this.links, function(link) {
        this.$el.append(navbarItemTemplate(link));
      }, this);

      return this;
    }
  });
});
