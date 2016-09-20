'use strict';

var gulp = require('gulp'),
    rev = require('gulp-rev'),
    plumber = require('gulp-plumber'),
    es = require('event-stream'),
    flatten = require('gulp-flatten'),
    replace = require('gulp-replace'),
    changed = require('gulp-changed');

var handleErrors = require('./handle-errors');
var config = require('./config');

module.exports = {
    deps: deps
}

// copy specific npm dependencies to accessible /vendor folder
function deps(){
    return gulp.src([
        'node_modules/core-js/client/shim.min.js',
        'node_modules/zone.js/dist/zone.js',
        'node_modules/reflect-metadata/Reflect.js',
        'node_modules/systemjs/dist/system.js',
        'node_modules/@angular/**/*.js',
        'node_modules/@ng-bootstrap/ng-bootstrap/**/*.js',
        'node_modules/rxjs/**/*.js',
        'node_modules/ui-router-ng2/**/*.js',
      //  'node_modules/jquery/dist/*.js'
    ], { base: 'node_modules' })
    .pipe(gulp.dest(config.dist + 'vendor'));
}
