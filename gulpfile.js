'use strict';

var gulp = require('gulp'),
    rev = require('gulp-rev'),
    ngConstant = require('gulp-ng-constant'),
    rename = require('gulp-rename'),
    runSequence = require('run-sequence'),
    browserSync = require('browser-sync'),
    plumber = require('gulp-plumber'),
    changed = require('gulp-changed'),
    ts = require('gulp-typescript'),
    sourcemaps = require('gulp-sourcemaps'),
    tslint = require('gulp-tslint');

var serve = require('./gulp/serve'),
    util = require('./gulp/utils'),
    copy = require('./gulp/copy'),
    inject = require('./gulp/inject'),
    build = require('./gulp/build'),
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
        .pipe(gulp.dest(config.dist  + 'app'))
        .pipe(browserSync.reload({stream: true}));
});

gulp.task('inject', ['inject:vendor']);
gulp.task('inject:vendor', inject.vendor);

gulp.task('ngconstant:dev', function () {
    return ngConstant({
        name: 'angular2ClientApp.common',
        constants: {
            VERSION: util.parseVersion(),
            DEBUG_INFO_ENABLED: true
        },
        template: config.constantTemplate,
        stream: true
    })
        .pipe(rename('app.constants.ts'))
        .pipe(gulp.dest(config.app + 'app/'));
});

gulp.task('ngconstant:prod', function () {
    return ngConstant({
        name: 'angular2ClientApp.common',
        constants: {
            VERSION: util.parseVersion(),
            DEBUG_INFO_ENABLED: false
        },
        template: config.constantTemplate,
        stream: true
    })
        .pipe(rename('app.constants.ts'))
        .pipe(gulp.dest(config.app + 'app/'));
});

// check app for any tslint errors
gulp.task('tslint', function() {
    return gulp.src(config.app + 'app/**/*.ts')
        .pipe(tslint())
        .pipe(tslint.report('verbose'));
});

// started via serve.js
gulp.task('watch', function () {
    gulp.watch('bower.json', ['install']);
    gulp.watch('./gulp/config.js', ['ngconstant:dev', 'tscompile', ]);
    gulp.watch(config.app + 'content/css/**/*.css', ['sync:styles']);
    gulp.watch(config.app + 'content/images/**', ['images']);
    gulp.watch(config.app + 'app/**/*.ts', ['tscompile']);
    gulp.watch(config.app + 'app/**/*.html', ['copy:html']);
    gulp.watch(config.app + 'i18n/**/*.json', ['copy:i18n']);
    gulp.watch([config.dist + '*.html', config.dist + 'app/**', config.dist + 'i18n/**']).on('change', browserSync.reload);
});

gulp.task('install', function () {
    runSequence('copy', 'inject', 'ngconstant:dev', 'tscompile');
});

gulp.task('serve', ['install'], serve);

gulp.task('build', function (cb) {
    runSequence('copy', 'inject', 'ngconstant:prod', 'tscompile', cb);
});

gulp.task('default', ['serve']);