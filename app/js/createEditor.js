define(['ace/ace'], function(ace) {
  return function(div, readOnly) {
    var editor = ace.edit(div);

    editor.setReadOnly(readOnly && true);

    // TODO: Fix the theme problems caused by require
    // The fix: optimize js files with r.js. Not sure how this will work with
    // Jade; might have to compile Jade to static html files.
    //editor.setTheme("ace/theme/monokai");
    editor.getSession().setMode("ace/mode/javascript");
    editor.getSession().setTabSize(2);
    return editor;
  };
});
