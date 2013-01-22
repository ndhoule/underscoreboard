/*jshint evil:true*/

(function(){

  // If the user provides a leading var keyword, we need to strip it before
  // we eval their code; otherwise, it won't be executed in the correct context
  var editorContents = parent.xeditor1.getValue();
  var currentFunction = parent.xfunction;

  //TODO: make less ghettofabulous
  var currentFunctionNames = currentFunction.aliases;

  // TODO: This sort of works for the moment: It does lazy matching, so it only
  // grabs the first var in the file and strips it. Once the server passes in
  // the name of our function we should concat it in so that a user can declare
  // a var before their underscore function without breaking the jasmine tests.
  // Not sure why they'd want to do this, but let's be nice to our users!
  // Passing a var to the RegExp constructor and using .replace() should let us
  // do this pretty easily.
  editorContents = editorContents.replace(/([\s\S])*?^var /m, '');

  // Unmap the function we're asking the user to implement
  // TODO: Refactor into one function
  var invalidateFunctions = function(){
    for (var i = 0, len = currentFunctionNames.length; i < len; i++){
      var functionName = currentFunctionNames[i];
      _[functionName] = undefined;
    }
  };

  var mapFunctions = function(){
    for (var i = 0, len = currentFunctionNames.length; i < len; i++){
      var functionName = currentFunctionNames[i];
      _[functionName] = eval(editorContents);
    }
  };

  invalidateFunctions();
  mapFunctions();

  if(!_.each){
    if(!window.each){
      throw new Error('You must define an each function either in the underscore namespace or in the global scope');
    }
    _.each = window.each;
  }
})();
