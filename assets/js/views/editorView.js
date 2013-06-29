define(['ace/ace', 'backbone'], function(ace, Backbone) {
  // Creates an editor and returns it. The first argument, div, is required and is
  // the element to be transformed into an editor. Optionally, accepts a readOnly
  // value; unless readOnly is set to false, the editor returned will be read-only.
  return Backbone.View.extend({
    defaults: {
      readOnly: false
    },

    initialize: function(options) {
      if (!document.getElementById(options.el)) {
        throw new Error('EditorView needs a div to create an Ace editor instance');
      }

      // Keep a reference to this view's element and init an Ace session
      this.el = options.el;
      options.readOnly && (this.readOnly = options.readOnly);
      this.initAce(this.el, this.readOnly);

      return this;
    },

    initAce: function(elementId) {
      // Set up and paint an editor instance
      this.aceSession = ace.edit(elementId);

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
