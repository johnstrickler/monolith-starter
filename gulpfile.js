'use strict';

var gulp = require('gulp'),
    rename = require('gulp-rename'),
    runSequence = require('run-sequence'),
    browserSync = require('browser-sync'),
    plumber = require('gulp-plumber'),
    ts = require('gulp-typescript'),
    sourcemaps = require('gulp-sourcemaps'),
    tslint = require('gulp-tslint');

var serve = require('./gulp/serve'),
    util = require('./gulp/utils'),
    copy = require('./gulp/copy'),
    inject = require('./gulp/inject'),
    config = require('./gulp/config');

var tsProject = ts.createProject('tsconfig.json');

// currently just an alias to copy:deps
gulp.task('copy', ['copy:node-deps', 'copy:bower-deps']);
gulp.task('copy:node-deps', copy.nodeDeps);
gulp.task('copy:bower-deps', copy.bowerDeps);

gulp.task('sync:styles', [], function () {
    return gulp.src(config.app + 'css')
        .pipe(browserSync.reload({stream: true}));
});

gulp.task('tscompile', function(cb){
    return gulp.src([config.app + 'app/**/*.ts', 'typings/**/*.d.ts'])
        .pipe(sourcemaps.init())
        .pipe(ts(tsProject))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(config.app  + 'app'))
        .pipe(browserSync.reload({stream: true}));
});

gulp.task('inject', ['inject:vendor']);
gulp.task('inject:vendor', inject.vendor);

// TODO not called yet (not part of a task workflow)
// check app for any tslint errors
gulp.task('tslint', function() {
    return gulp.src(config.app + 'app/**/*.ts')
        .pipe(tslint())
        .pipe(tslint.report('verbose'));
});

// started via serve.js
gulp.task('watch', function () {
    gulp.watch(config.app + 'css/**/*.css', ['sync:styles']);
    gulp.watch(config.app + 'app/**/*.ts', ['tscompile']);
    gulp.watch([
        config.app + 'app/**/*.ts',
        config.app + 'css/**/*.css',
        config.app + '*.ftl'
    ]).on('change', browserSync.reload);
});

gulp.task('install', function () {
    runSequence('copy', 'inject', 'tscompile');
});

gulp.task('build', function (cb) {
    runSequence('copy', 'inject', 'tscompile', cb);
});

gulp.task('serve', ['install'], serve);

gulp.task('default', ['serve']);