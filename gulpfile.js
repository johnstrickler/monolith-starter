'use strict';

var gulp = require('gulp'),
    rev = require('gulp-rev'),
    templateCache = require('gulp-angular-templatecache'),
    htmlmin = require('gulp-htmlmin'),
    imagemin = require('gulp-imagemin'),
    ngConstant = require('gulp-ng-constant'),
    rename = require('gulp-rename'),
    eslint = require('gulp-eslint'),
    es = require('event-stream'),
    flatten = require('gulp-flatten'),
    del = require('del'),
    runSequence = require('run-sequence'),
    browserSync = require('browser-sync'),
    KarmaServer = require('karma').Server,
    plumber = require('gulp-plumber'),
    changed = require('gulp-changed'),
    gulpIf = require('gulp-if'),
    ts = require('gulp-typescript'),
    sourcemaps = require('gulp-sourcemaps'),
    tslint = require('gulp-tslint');

var handleErrors = require('./gulp/handle-errors'),
    serve = require('./gulp/serve'),
    util = require('./gulp/utils'),
    copy = require('./gulp/copy'),
    inject = require('./gulp/inject'),
    build = require('./gulp/build');

var tsProject = ts.createProject('tsconfig.json');
var config = require('./gulp/config');

gulp.task('clean', function () {
    return del([config.dist], { dot: true });
});

// currently just an alias to copy:deps
gulp.task('copy', [copy.nodeDeps, copy.bowerDeps]);

gulp.task('copy:temp', function () {
    return gulp.src([config.app + '/**/*', '!' + config.app + '/**/*.ts', '!' + config.sassSrc])
        .pipe(plumber({errorHandler: handleErrors}))
        .pipe(changed(config.dist))
        .pipe(gulp.dest(config.dist));
});




gulp.task('styles', [], function () {
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

gulp.task('inject', ['tscompile','inject:dep']);

gulp.task('inject:dep', ['inject:test', 'inject:vendor']);

gulp.task('inject:vendor', inject.vendor);

gulp.task('inject:test', inject.test);

gulp.task('inject:troubleshoot', inject.troubleshoot);

gulp.task('assets:prod', ['images', 'styles', 'html', 'copy:swagger'], build);

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

// check app for eslint errors
gulp.task('eslint', function () {
    return gulp.src(['gulpfile.js', config.app + 'app/**/*.js'])
        .pipe(plumber({errorHandler: handleErrors}))
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failOnError());
});

// check app for eslint errors anf fix some of them
gulp.task('eslint:fix', function () {
    return gulp.src(config.app + 'app/**/*.js')
        .pipe(plumber({errorHandler: handleErrors}))
        .pipe(eslint({
            fix: true
        }))
        .pipe(eslint.format())
        .pipe(gulpIf(util.isLintFixed, gulp.dest(config.app + 'app')));
});

// check app for any tslint errors
gulp.task('tslint', function() {
    return gulp.src('app/**/*.ts')
        .pipe(tslint())
        .pipe(tslint.report('verbose'));
});

gulp.task('test', ['inject:test', 'ngconstant:dev'], function (done) {
    new KarmaServer({
        configFile: __dirname + '/' + config.test + 'karma.conf.js',
        singleRun: true
    }, done).start();
});


gulp.task('watch', function () {
    gulp.watch('bower.json', ['install']);
    gulp.watch(['gulpfile.js', 'build.gradle'], ['ngconstant:dev']);
    gulp.watch(config.app + 'content/css/**/*.css', ['styles']);
    gulp.watch(config.app + 'content/images/**', ['images']);
    gulp.watch(config.app + 'app/**/*.ts', ['tscompile']);
    gulp.watch(config.app + 'app/**/*.html', ['copy:html']);
    gulp.watch(config.app + 'i18n/**/*.json', ['copy:i18n']);
    gulp.watch([config.dist + '*.html', config.dist + 'app/**', config.dist + 'i18n/**']).on('change', browserSync.reload);
});

gulp.task('install', ['clean'], function () {
    runSequence('copy:temp', ['inject:dep', 'ngconstant:dev', 'copy:deps'], 'tscompile', 'inject:troubleshoot');
});

gulp.task('serve', ['install'], serve);

gulp.task('build', ['clean'], function (cb) {
    runSequence(['copy', 'inject:vendor', 'ngconstant:prod'], 'tscompile', 'inject:troubleshoot', 'assets:prod', cb);
});

gulp.task('default', ['serve']);
