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

    var stream = gulp.src(config.app + 'index.ftl')
        .pipe(plumber({errorHandler: handleErrors}))
        .pipe(inject(gulp.src(config.app + 'vendor/**/*.js', {read: false})))
        .pipe(gulp.dest(config.app));

    return stream;
}