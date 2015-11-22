'use strict';

var path = require('path');
var fs = require('fs');
var gulp = require('gulp-help')(require('gulp'), {hideDepsMessage: true});
var args = require('yargs').argv;
var through = require('through2');
var browserSync = require('browser-sync').create();
var $ = require('gulp-load-plugins')({
    pattern: [
        'gulp-*', 'gulp.*',
        'main-bower-files',
        'uglify-save-license',
        'del',
        'merge-stream',
        'run-sequence',
        'karma'
    ]
});

//////////////////////////////////////////////////////////
// Tuning

process.setMaxListeners(0);      // Disable max listeners for gulp

// Workaround for nodemon exit issue:
// https://github.com/JacksonGariety/gulp-nodemon/issues/33
function exitHandler() { process.exit(0); }
process.once('SIGINT', exitHandler);

//////////////////////////////////////////////////////////
// Configuration

var isVerbose = args.verbose;    // Enable extra verbose logging
var isProduction = args.prod;    // Run extra steps (minification) with production flag --prod

var paths = {
    clientSrc:   'client/src',
    clientBuild: 'build/client',
    clientTests: 'client/test',
    serverSrc:   'server/src',
    serverTests: 'server/test',
    tmp: '.tmp'
};
var jsLoadOrder = [
    '**/app.module.js',
    '**/*.module.js',
    '**/*.js'
];
var jsLintPaths = [
    path.join(paths.clientSrc, '/app/**/*.js'),
    path.join(paths.clientTests, '/**/*.js'),
    path.join(paths.serverSrc, '/app/**/*.js'),
    path.join(paths.serverTests, '/**/*.js')
];

//////////////////////////////////////////////////////////
// Gulp Tasks

/**
 * Clean temporary folders and files
 */
gulp.task('clean', false, function(next) {
    $.del([paths.tmp, paths.clientBuild])
        .then(function() { next(); });
});

/**
 * Create $templateCache from the html templates
 */
gulp.task('partials', false, function() {
    return gulp
        .src(path.join(paths.clientSrc, '/app/**/*.html'))
        .pipe($.cached('partials'))
        .pipe(verbosePrintFiles('partials'))
        .pipe($.if(isProduction, $.minifyHtml({
            empty: true,
            spare: true,
            quotes: true
        })))
        .pipe($.remember('partials'))
        .pipe($.angularTemplatecache('templateCacheHtml.js', {
            module: 'app',
            root: '/app',
            standalone: false
        }))
        .pipe(gulp.dest(path.join(paths.clientBuild, '/js/')));
});

/**
 * JS Bundles (vendor and app)
 */
gulp.task('vendor-scripts', false, function() {
    var stream = gulp
        .src($.mainBowerFiles())
        .pipe($.filter('**/*.js'))
        .pipe(verbosePrintFiles('vendor-scripts'));

    return scriptProcessing(stream, 'vendor.js');
});

gulp.task('app-scripts', false, function() {
    var stream = gulp
        .src(path.join(paths.clientSrc, '/app/**/*.js'))
        .pipe($.cached('app-scripts'))
        .pipe($.ngAnnotate({add: true, single_quotes: true}))
        .pipe($.remember('app-scripts'))
        .pipe($.order(jsLoadOrder)) // *Important*: Must come after $.remember to preserve order
        .pipe(verbosePrintFiles('app-scripts'));

    return scriptProcessing(stream, 'app.js');
});

function scriptProcessing(stream, bundleFile) {
    return stream
        .pipe($.if(isProduction, $.sourcemaps.init()))
        .pipe($.concat(bundleFile))
        .pipe($.if(isProduction, $.uglify({ preserveComments: $.uglifySaveLicense })))
            .on('error', errorHandler('uglify'))
        .pipe($.if(isProduction, $.sourcemaps.write('maps')))
        .pipe(gulp.dest(path.join(paths.clientBuild, '/js/')));
}

/**
 * JS Linting
 */
gulp.task('lint', false, function() {
    return gulp
        .src(jsLintPaths)
        .pipe(verbosePrintFiles('lint'))
        .pipe($.jshint())
        .pipe($.jshint.reporter('jshint-stylish'))
        .pipe($.jshint.reporter('fail'));
});

/**
 * JS Code complexity
 */
gulp.task('complexity', false, function() {
    return gulp
        .src([
            path.join(paths.clientSrc, '/app/**/*.js'),
            path.join(paths.serverSrc, '/app/**/*.js')
        ])
        .pipe(verbosePrintFiles('complexity'))
        .pipe($.complexity({
            cyclomatic: 12,
            halstead: 20,
            maintainability: 80,
            breakOnErrors: false,
            verbose: true
        }));
});

gulp.task('analyze', 'Static JavaScript code analysis (linting, complexity)', function(next) {
    $.runSequence('lint', 'complexity', next);
});

/**
 * CSS bundles (vendor and app)
 */
gulp.task('vendor-styles', false, function() {
    return gulp
        .src($.mainBowerFiles())
        .pipe($.filter('**/*.css'))
        .pipe(verbosePrintFiles('vendor-styles'))
        .pipe($.concat('vendor.css'))
        .pipe(gulp.dest(path.join(paths.clientBuild, '/css/')));
});

gulp.task('app-styles', false, function() {
    return gulp
        .src(path.join(paths.clientSrc, '/styles/**/*.css'))
        .pipe(verbosePrintFiles('app-styles'))
        .pipe($.cached('app-styles'))
        .pipe($.remember('app-styles'))
        .pipe($.concat('app.css'))
        .pipe(gulp.dest(path.join(paths.clientBuild, '/css/')));
});

/**
 * Vendor fonts
 */
gulp.task('vendor-fonts', false, function() {
    return gulp.src($.mainBowerFiles())
        .pipe($.filter('**/*.{eot,svg,ttf,woff,woff2,otf}'))
        .pipe(verbosePrintFiles('vendor-fonts'))
        .pipe($.flatten())
        .pipe(gulp.dest(path.join(paths.clientBuild, '/fonts/')));
});

/**
 * Static files copy
 */
gulp.task('static', false, function() {
    return gulp.src(path.join(paths.clientSrc, '/static/**'))
        .pipe(verbosePrintFiles('static'))
        .pipe(gulp.dest(path.join(paths.clientBuild, '/')));
});

/**
 * HTML processing
 */
gulp.task('html', false, function() {
    return gulp.src(path.join(paths.clientSrc, '/*.html'))
        .pipe(verbosePrintFiles('html'))
        .pipe($.if(isProduction, $.minifyHtml({
            empty: true,
            spare: true,
            quotes: true,
            conditionals: true
        })))
        .pipe(gulp.dest(path.join(paths.clientBuild, '/')));
});

/**
 * Cache-bust asset files
 */
gulp.task('cachebust', false, [
    'partials', 'vendor-scripts', 'app-scripts',
    'vendor-styles', 'app-styles',
    'vendor-fonts', 'static', 'html'
], function() {
    if (!isProduction) { return; }

    // Files to rename and cache bust
    var revFilter = $.filter([
        '**', '!**/*.html', '!**/favicon.ico', '!**/browserconfig.xml', '!**/*.map'
    ], {restore: true});

    return gulp
        .src(path.join(paths.clientBuild, '/**'))
        .pipe(revFilter)
        .pipe($.rev())
        .pipe(revFilter.restore)
        .pipe($.revReplace({replaceInExtensions: ['.js', '.css', '.html', '.xml']}))
        .pipe(gulp.dest(paths.clientBuild))
        .pipe(cleanupRevedFiles())
        .pipe($.rev.manifest())
        .pipe(gulp.dest(paths.clientBuild));
});

gulp.task('build', false, function(next) {
    $.runSequence('clean', 'cachebust', next);
});

/**
 * Start the Express service with nodemon
 */
gulp.task('serve', false, function(next) {
    var firstStart = true;
    var serverPort = 8000;
    $.nodemon({
        script: path.join(paths.serverSrc, '/app/start-server.js'),
        ext: 'js',
        delayTime: 1,
        env: {
            'NODE_ENV': 'development',
            'DEBUG_REQUEST': (isVerbose) ? '1' : '0',
            'PORT': serverPort
        },
        nodeArgs: ['--debug=5800'],
        watch: [paths.serverSrc],
        stdout: false // important for 'readable' event
    })
    // The http server might not have started listening yet when
    // the `restart` event has been triggered. It's best to explicitly
    // check whether it is ready for connections or not.
    .on('readable', function() {
        this.stdout.on('data', function(chunk) {
            isVerbose && process.stdout.write(chunk);
            if (/listening at http/.test(chunk)) {
                if (firstStart) {
                    firstStart = false;
                    startBrowserSync(serverPort, next);
                } else {
                    browserSync.reload();
                }
            }
        });
        this.stderr.pipe(process.stdout);
    });
});

function startBrowserSync(serverPort, next) {
    if (browserSync.active) {
        browserSync.reload();
        return next();
    }

    var browserSyncPort = 3000;
    $.util.log('Starting browser-sync on port', browserSyncPort);

    var options = {
        // Proxy to separate static server
        proxy: 'localhost:' + serverPort,
        port: browserSyncPort,
        files: [path.join(paths.clientBuild, '/**')],
        ghostMode: {
            clicks: true,
            location: false,
            forms: true,
            scroll: true
        },
        injectChanges: true,
        logFileChanges: true,
        logLevel: 'info',
        logPrefix: 'ngSPA',
        notify: true,
        minify: false,
        reloadDelay: 1000,
        browser: [process.env['BROWSERSYNC_BROWSER'] || 'google chrome'],
        open: false
    };
    browserSync.init(options, next);
}

/**
 * Watch for file changes and rebuild
 */
gulp.task('watch', false, ['build'], function() {
    gulp.watch(jsLintPaths.concat('.jshintrc'), ['lint'])
        .on('change', onWatchChange);
    gulp.watch(path.join(paths.clientSrc, '/app/**/*.js'), ['app-scripts'])
        .on('change', onWatchChange);
    gulp.watch(path.join(paths.clientSrc, '/styles/**/*.css'), ['app-styles'])
        .on('change', onWatchChange);
    gulp.watch(path.join(paths.clientSrc, '/app/**/*.html'), ['partials'])
        .on('change', onWatchChange);
    gulp.watch(path.join(paths.clientSrc, '/*.html'), ['html'])
        .on('change', onWatchChange);
});

/**
 * Development watch and serve
 */
gulp.task('dev', 'Development mode: start server, watch for changes, rebuild', function(next) {
    $.runSequence('watch', 'serve', next);
});

/**
 * Unit testing
 */
// Run client-side unit tests (once)
gulp.task('test-client', false, function(next) {
    runClientTests(false, next);
});

// Run client-side unit tests continuously upon file changes
gulp.task('dev-test-client', false, function(next) {
    runClientTests(true, next);
});

function runClientTests(watch, next) {
    var karmaServer = new $.karma.Server({
        configFile: __dirname + '/karma.conf.js',
        singleRun: !watch,
        autoWatch: watch
    }, karmaDone);
    karmaServer.start();

    function karmaDone(numFailedTests) {
        next(numFailedTests ? new Error('Failed tests') : null);
    }
}

// Run server-side unit tests (once)
gulp.task('test-server', false, function() {
    return streamServerTests();
});

// Run client-side unit tests continuously upon file changes
gulp.task('dev-test-server', false, ['test-server'], function() {
    gulp.watch([
        path.join(paths.serverSrc, '/app/**/*.js'),
        path.join(paths.serverTests, '/**/*.js')
    ], ['test-server'])
        .on('change', onWatchChange);
});

function streamServerTests() {
    return gulp
        .src(path.join(paths.serverTests, '/**/*.spec.js'), {read: false})
        .pipe(verbosePrintFiles('mocha'))
        .pipe($.mocha({reporter: 'progress'}))
        .on('error', errorHandler('mocha'));
}

gulp.task('test', 'Run client/server unit tests (once)', function(next) {
    $.runSequence('test-client', 'test-server', next);
});

gulp.task('dev-test', 'Run unit tests continuously upon file changes',
    ['dev-test-client', 'dev-test-server']);

/**
 * Default task: clean temporary directories
 * and launch the main build task
 */
gulp.task('default', 'Performs a clean production build for deployment', function(next) {
    isProduction = true;
    $.runSequence('build', next);
},{
    options: {
        'verbose': 'Verbose debug logging'
    }
});

//////////////////////////////////////////////////////////
// Utility functions

function errorHandler(taskName, options) {
    options = options || {};
    return function(err) {
        $.util.log($.util.colors.red('[' + taskName + ']'), err.toString());
        if (options.exit) {
            process.exit(1);
        } else {
            this.emit('end');
        }
    };
}

function verbosePrintFiles(taskName) {
    return $.if(isVerbose, $.print(function(filepath) {
        return '[' + taskName + '] ' + filepath;
    }));
}

function cleanupRevedFiles() {
    return through.obj(function(file, enc, next) {
        this.push(file);
        if (!file.revOrigPath) { return next(); }
        fs.unlink(file.revOrigPath, function (err) {
            next();
        });
    });
}

function onWatchChange(event) {
    isVerbose && $.util.log('Watch', event.type, path.relative(process.cwd(), event.path));
}
