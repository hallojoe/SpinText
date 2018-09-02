'use strict';
 
var gulp = require('gulp');
var sass = require('gulp-sass');
var webserver = require('gulp-webserver');
  
gulp.task('default', ['sass', 'sass:watch', 'webserver'], function () { });

gulp.task('webserver', function() {
  gulp.src('./')
    .pipe(webserver({
      livereload: true,
      directoryListing: {
        enable: true,
        path: './'
      },
      open: true
    }));
});
  
gulp.task('sass', function () {
  return gulp.src('./assets/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./assets'));
});
 
gulp.task('sass:watch', function () {
  gulp.watch('./assets/**/*.scss', ['sass']);
});
