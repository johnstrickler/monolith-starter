'use strict';

var gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    inject = require('gulp-inject'),
    es = require('event-stream'),
    bowerFiles = require('main-bower-files');

var handleErrors = require('./handle-errors');

var config = require('./config');

module.exports = {
    vendor: vendor,
    test: test
}

function vendor() {

    var stream = gulp.src(config.dist + 'index.html')
        .pipe(plumber({errorHandler: handleErrors}))
        .pipe(inject(gulp.src(bowerFiles(), {read: false}), {
            name: 'bower',
            relative: false,
            transform: function (filepath) {
                if ( filepath.indexOf('.css') !== -1 ) {
                    return '<link rel="stylesheet" href="' + filepath.replace('/src/main/webapp/', '') + '"/>'; // TODO temp hack
                } else {
                    return '<script src="' + filepath.replace('/src/main/webapp/', '') + '"></script>'; // TODO temp hack
                }                
            }
        }))
        .pipe(gulp.dest(config.dist));

    return stream;
}

// TODO - integrate Karma tests
function test() {
    return gulp.src(config.test + 'karma.conf.js')
        .pipe(plumber({errorHandler: handleErrors}))
        .pipe(inject(gulp.src(bowerFiles({includeDev: true, filter: ['**/*.js']}), {read: false}), {
            starttag: '// bower:js',
            endtag: '// endbower',
            transform: function (filepath) {
                return '\'' + filepath.substring(1, filepath.length) + '\',';
            }
        }))
        .pipe(gulp.dest(config.test));
}

