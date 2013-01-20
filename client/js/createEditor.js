define(['ace/ace'], function(ace){
  return function(div, readOnly){
    var editor = ace.edit(div);

    editor.setReadOnly(readOnly && true);

    editor.setTheme("ace/theme/monokai");
    editor.getSession().setMode("ace/mode/javascript");
    editor.getSession().setTabSize(2);
    return editor;
  };
});
