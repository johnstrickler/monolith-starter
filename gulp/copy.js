'use strict';
var gulp = require('gulp');
var config = require('./config');

module.exports = {
    nodeDeps: nodeDeps
    /*, bowerDeps: bowerDeps */
}

// copy specific npm dependencies to accessible /vendor folder
function nodeDeps(){
    return gulp.src([
        'node_modules/core-js/client/shim.min.js',
        'node_modules/zone.js/dist/zone.js',
        'node_modules/reflect-metadata/Reflect.js',
        'node_modules/systemjs/dist/system.js',
        'node_modules/@angular/**/bundles/*.js',
        'node_modules/rxjs/**/*.js'
    ], { base: 'node_modules' })
        .pipe(gulp.dest(config.app + 'vendor'));
}

// copy specific npm dependencies to accessible /vendor folder
//function bowerDeps(){
//    return gulp.src(bowerFiles())
//        .pipe(gulp.dest(config.app + 'vendor'));
//}