/*globals _: true, chai: true, expect: true, sinon: true, stubs: true*/

'use strict';

var path = require('path');

global.chai = require('chai');
global.expect = global.chai.expect;
global.sinon = require('sinon');

// Chai plugins
global.chai.use(require('sinon-chai'));

// Stubs and mocks
global.stubs = require(path.join(__dirname, '../stubs'));
