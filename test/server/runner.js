// Require testing and support libraries
global._ = require('lodash');
global.chai = require('chai');
global.expect = global.chai.expect;
global.path = require('path');

// Handy shortcuts!
global.appDir = path.join(__dirname, '../..', 'app');

// Require and configure blanket.js, a code coverage tool
require('blanket')({
  pattern: '/app/'
});
