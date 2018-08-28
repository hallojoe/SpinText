'use strict';
 
var gulp = require('gulp');
var webserver = require('gulp-webserver');
  
gulp.task('default', ['webserver'], function () { });

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