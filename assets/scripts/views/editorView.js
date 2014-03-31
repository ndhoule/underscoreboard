define([
  'ace/ace',
  'backbone',
  'underscore',
  'vent'
], function(ace, Backbone, _, vent) {
  'use strict';

  return Backbone.View.extend({
    initialize: function() {
      this.editor = ace.edit(this.el);

      this.setReadOnly(this.model.get('readOnly'));
      this.setMode(this.model.get('mode'));
      this.setTheme(this.model.get('theme'));
      this.setTabSize(this.model.get('tabSize'));

      if (this.model.get('player') === 'player') {
        this.editor.on('change', _.bind(function() {
          vent.trigger('editor:change', this.editor.getValue());
        }, this));
      }

      return this;
    },

    setReadOnly: function(flag) {
      this.editor.setReadOnly(flag);
    },

    setMode: function(mode) {
      this.editor.session.setMode('ace/mode/' + mode);
    },

    setTheme: function(theme) {
      this.editor.setTheme('ace/theme/' + theme);
    },

    setTabSize: function(size) {
      this.editor.session.setTabSize(size);
    },

    // Takes the server-defined placeholder text and inserts it into the editor.
    // The start point for the text is always the end of the second-to-last
    // line, so move the cursor there while we're at it
    resetEditor: function() {
      var text;
      var fn = Underscoreboard.get('currentFunction');

      var description = _.map(fn.description.split('\n'), function(text) {
        return '// ' + text;
      }).join('\n');

      try {
        text = description + '\n' + fn.boilerplate;
      } catch (e) {
        text = '';
      }

      return this.setValue(text);
    },

    setValue: function(text) {
      this.editor.setValue(text);
      this.editor.selection.moveCursorBy(-1, 0);
      this.editor.selection.clearSelection();

      // Return the editor's current value
      return this.editor.getValue();
    }
  });
});
