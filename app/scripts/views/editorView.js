define(['ace/ace', 'backbone'], function(ace, Backbone) {
  return Backbone.View.extend({
    initialize: function(opts) {
      this.readOnly = opts.readOnly || false;

      this.initAce();

      return this;
    },

    initAce: function(el) {
      // Set up and paint an editor instance
      this.aceSession = ace.edit(this.el);

      // Sessions are writable by default; set read-only if readOnly property
      // passed in
      this.aceSession.setReadOnly(this.readOnly);

      // Set some JavaScript-centric settings
      this.aceSession.getSession().setMode('ace/mode/javascript');
      this.aceSession.getSession().setTabSize(2);
    },

    // Takes the server-defined placeholder text and inserts it into the editor.
    // The start point for the text is always the end of the second-to-last line,
    // so move the cursor there while we're at it
    resetEditor: function() {
      var text,
          fn = window.UNDERSCOREBOARD.currentFunction;

      try {
        text = fn.desc.join('\n') + '\n' + fn.boiler.join('\n');
      } catch (e) {
        text = '';
      }

      return this.setValue(text);
    },

    setValue: function(text) {
      this.aceSession.setValue(text);
      this.aceSession.selection.moveCursorBy(-1, 0);
      this.aceSession.selection.clearSelection();

      // Return the editor's current value
      return this.aceSession.getValue();
    }
  });
});
