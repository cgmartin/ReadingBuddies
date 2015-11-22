'use strict';

var mainBowerFiles = require('main-bower-files');

function getFileList() {
    return mainBowerFiles({filter: /.*js$/i, includeDev: true})
        .concat([
            'client/src/app/**/*.module.js',
            'client/src/app/**/*.js',
            'client/src/app/**/*.html',
            'client/test/app/**/*.spec.js'
        ])
        .concat({ pattern: 'client/test/fixtures/assets/*.png', watched: false, included: false, served: true });
}

// Karma configuration
module.exports = function (config) {
    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',

        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['mocha', 'chai', 'sinon'],

        // list of karma plugins
        plugins: [
            'karma-mocha',
            'karma-chai',
            'karma-sinon',
            'karma-phantomjs-launcher',
            'karma-ng-html2js-preprocessor'
        ],

        // list of files / patterns to load in the browser
        files: getFileList(),

        proxies: {
            '/fake.png': '/base/client/test/fixtures/assets/fake.png'
        },

        // list of files to exclude
        exclude: [],


        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            'client/src/app/**/*.html': ['ng-html2js']
        },

        ngHtml2JsPreprocessor: {
            stripPrefix: 'client/src',
            moduleName:  'app'
        },


        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['progress'],


        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: false,


        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['PhantomJS'],


        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: true,

        // Concurrency level
        // how many browser should be started simultanous
        concurrency: Infinity
    });
};
