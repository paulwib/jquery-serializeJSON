// Karma configuration
//
// For all available config options and default values, see:
// http://karma-runner.github.io/0.10/config/configuration-file.html

module.exports = function (config) {
    'use strict';

    config.set({

        // Base path, that will be used to resolve files and exclude
        basePath: './',

        // Frameworks to use
        frameworks: ['jasmine'],

        // List of files / patterns to load in the browser
        files: [

            'bower_components/jquery/dist/jquery.js',
            'bower_components/jasmine-jquery/lib/jasmine-jquery.js',
            'lib/jquery.serializeJSON.js',
            'test/spec/**/*.spec.js',
            {
                pattern: 'test/fixtures/*.html',
                included: false,
                served: true
            }
        ],

        preprocessors: {
            'lib/**/*.js': 'coverage'
        },

        coverageReporter: {
            type: 'html',
            dir: 'test/coverage'
        },

        // test results reporter to use
        // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
        reporters: ['progress', 'coverage'],

        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,

        // Start these browsers, currently available:
        // - Chrome
        // - ChromeCanary
        // - Firefox
        // - Opera
        // - Safari (only Mac)
        // - PhantomJS
        // - IE (only Windows)
        browsers: [
            'Chrome',
            'Firefox',
            'PhantomJS'
        ],

        // If browser does not capture in given timeout [ms], kill it
        captureTimeout: 5000,

        // Continuous Integration mode
        // if true, it capture browsers, run tests and exit
        singleRun: false,

        // Karma will report all the tests that are slower than given time limit (in
        // ms).
        reportSlowerThan: 500
    });
};
