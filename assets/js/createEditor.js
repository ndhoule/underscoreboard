define(['ace/ace'], function(ace) {
  // Creates an editor and returns it. The first argument, div, is required and is
  // the element to be transformed into an editor. Optionally, accepts a readOnly
  // value; unless readOnly is set to false, the editor returned will be read-only.
  return function(div, readOnly) {
    var editor = ace.edit(div);

    editor.setReadOnly(readOnly && true);
    // Defaults to javascript mode, two space-soft tabs
    editor.getSession().setMode("ace/mode/javascript");
    editor.getSession().setTabSize(2);

    return editor;
  };
});
