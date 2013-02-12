/*jshint evil:true*/
/*globals _:true, window:true, parent:true*/

(function(){
  // Note: Globals prevent use of "use strict" here.
  var playerEditor, currentFunction;

  // Squelch errors with a try statement. We expect that a currentFunction won't be
  // defined 100% of the time.
  try {
    playerEditor = parent.underscoreboardGlobals.playerEditor.getValue();
    currentFunction = parent.underscoreboardGlobals.currentFunction.aliases;

    // If the user provides a leading var keyword, we need to strip it before
    // we eval their code; otherwise, it won't be executed in the correct context
    playerEditor = playerEditor.replace(/([\s\S])*?^var /m, '');

    // Unmap the function we're asking the user to implement (as well as its aliases).
    // Leave all other underscore functions in so that players can use functions
    // such as each(), map(), or reduce() to implement other functions.
    var remapFunctions = function(){
      for (var i = 0, len = currentFunction.length; i < len; i++){
        var functionName = currentFunction[i];
        // First, invalidate currentFunction and its aliases
        _[functionName] = undefined;
        // Next, use eval to assign the user's code to the function name we just unmapped.
        _[functionName] = eval(playerEditor);
      }
    }();
  } catch(e) {
    // Don't need to do anything with the error
  }
})();
