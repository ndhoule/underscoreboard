// Karma configuration
// Generated on Sat Jun 29 2013 17:37:32 GMT-0700 (PDT)


// base path, that will be used to resolve files and exclude
basePath = '';


// list of files / patterns to load in the browser
files = [
  MOCHA,
  MOCHA_ADAPTER,
  REQUIRE,
  REQUIRE_ADAPTER,

  // Load testing framework libraries
  { pattern: 'node_modules/chai/chai.js', included: false },
  { pattern: 'node_modules/lodash/lodash.js', included: false },

  // Load source files
  { pattern: 'assets/js/**/*.js', included: false },
  { pattern: 'app/**/*.js', included: false },

  // Load specs
  { pattern: 'test/unit/**/*Spec.js', included: false },

  // Load the Require.js spec helper
  'test/main-test.js'
];


// list of files to exclude
exclude = [
  'app/public/**/*',
  'assets/js/lib/**/*'
];


// test results reporter to use
// possible values: 'dots', 'progress', 'junit'
reporters = ['progress'];


// web server port
port = 9876;


// cli runner port
runnerPort = 9100;


// enable / disable colors in the output (reporters and logs)
colors = true;


// level of logging
// possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
logLevel = LOG_INFO;


// enable / disable watching file and executing tests whenever any file changes
autoWatch = false;


// Start these browsers, currently available:
// - Chrome
// - ChromeCanary
// - Firefox
// - Opera
// - Safari (only Mac)
// - PhantomJS
// - IE (only Windows)
browsers = ['PhantomJS'];


// If browser does not capture in given timeout [ms], kill it
captureTimeout = 60000;


// Continuous Integration mode
// if true, it capture browsers, run tests and exit
singleRun = false;
