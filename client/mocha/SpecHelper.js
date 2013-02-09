/*jshint evil:true*/
/*globals _:true, window:true, parent:true*/

(function(){
  // Note: Globals prevent use of "use strict" here.
  var editorContents = parent.xeditor1.getValue();
  var currentFn = parent.xcurrentFn.aliases;

  // If the user provides a leading var keyword, we need to strip it before
  // we eval their code; otherwise, it won't be executed in the correct context
  editorContents = editorContents.replace(/([\s\S])*?^var /m, '');

  // Unmap the function we're asking the user to implement (as well as its aliases).
  // Leave all other underscore functions in so that players can use functions
  // such as each(), map(), or reduce() to implement other functions.
  var mapFunctions = function(){
    for (var i = 0, len = currentFn.length; i < len; i++){
      var functionName = currentFn[i];
      // First, invalidate currentFn and its aliases
      _[functionName] = undefined;
      // Next, use eval to assign the user's code to the function name we just unmapped.
      _[functionName] = eval(editorContents);
    }
  }();
})();
