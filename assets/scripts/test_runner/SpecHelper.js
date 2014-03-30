/*jshint evil:true*/
/*globals _:true, parent:true*/

(function() {
  'use strict';

  window.mocha.setup({
    ui: 'bdd',
    ignoreLeaks: true
  });

  var messageHandler = function(event) {
    if (event.origin !== window.location.origin || event.data === 'mocha-zero-timeout') {
      return;
    }

    hotReload('_', event.data.code, event.data.currentFunction.aliases);
    runMocha(function(result) {
      parent.postMessage(result.stats, window.location.origin);
    });
  };

  var runMocha = function(cb) {
    var result;

    document.getElementById('mocha').innerHTML = '';
    result = window.mocha.run();
    result.on('suite end', function() {
      cb(result);
    });
  };

  var hotReload = function(namespace, code, functionNames) {
    var i;

    if (!namespace) {
      throw new Error('Must provide a target namespace to map evaled code onto.');
    }

    if (!_.isString(namespace)) {
      throw new TypeError('Target namespace must be a string.');
    }

    if (_.isString(functionNames)) {
      functionNames = [functionNames];
    }

    // If the user provides a leading var keyword, we need to strip it before
    // we eval their code; otherwise, it won't be executed in the correct
    // context
    window.code = code;

    // Remove commented lines and parse out function naming. Supports both
    // function expressions and statements
    code = code.replace(/^\s*\/\/.*$(\r\n?|\n)?/gm, '').trim();
    code = code.replace(/(var?\s*[\$\w\s].*=\s*)|((?!function)\s+[A-Za-z\$\_0-9]*)/m, '');

    // Unmap the function we're asking the user to implement (as well as its
    // aliases). Leave all other underscore functions in so players can
    // implement their functions in terms of other functions
    try {
      for (i = 0; i < functionNames.length; i++) {
        namespace[functionNames[i]] = undefined;
        eval(namespace + '.' + functionNames[i] + ' = ' + code);
      }
    } catch(e) {
      for (i = 0; i < functionNames.length; i++) {
        namespace[functionNames[i]] = undefined;
      }
      console.warn('Failed to eval code into', namespace + '.' + functionNames[i] + '.', 'Error:', e);
    }
  };

  // Attach an event listener to the window
  window.addEventListener('message', messageHandler, false);
}).call(this);
