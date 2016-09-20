'use strict';

var gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    inject = require('gulp-inject');

var handleErrors = require('./handle-errors');

var config = require('./config');

module.exports = {
    vendor: vendor
}

function vendor() {

    var stream = gulp.src(config.src + 'index.html')
        .pipe(plumber({errorHandler: handleErrors}))
        .pipe(inject(gulp.src('src/main/webapp/vendor/**/*.js', {read: false})))
        .pipe(gulp.dest(config.src));

    return stream;
}