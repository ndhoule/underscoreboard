// Build file for require.js. Compiles down to
({
  baseUrl: 'app/js',

  name: 'main',
  out: 'client/js/main.js',
  optimize: 'uglify2',

  paths: {
    jquery       : 'lib/require-jquery'
  , ace          : '../../client/js/lib/ace'
  , domReady     : 'lib/domReady'
  , bootstrap    : 'lib/bootstrap.min'
  , createEditor : 'createEditor'
  , io           : '../../node_modules/socket.io/node_modules/socket.io-client/dist/socket.io'
  }
})
