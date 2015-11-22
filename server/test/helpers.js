'use strict';

var path = require('path');

var SERVER_SRC_PATH = exports.SERVER_SRC_PATH = './server/src';
var SERVER_TEST_PATH = exports.SERVER_TEST_PATH = './server/test';

// Global utilities
global.mockery = require('mockery');
global.expect  = require('chai').expect;
global.sinon   = require('sinon');

/**
 * Get the file path of the source module under test, based on the filename/path convention:
 *  - folder structure should match between `src` and `test` base directories
 *  - filename of test should match src file, except for the `.spec.` part: `foo.spec.js` -> `foo.js`
 */
exports.moduleUnderTest = function(filename) {
    var relPath = path
        .relative(SERVER_TEST_PATH, filename)
        .replace(/\.spec\.js$/, '.js');
    return path.resolve(path.join(SERVER_SRC_PATH, relPath));
};

function stripSpecFileName(filename) {
    return filename.replace(/\.spec\.js$/, '.js');
}
