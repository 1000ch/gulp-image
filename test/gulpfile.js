var gulp  = require('gulp');
var image = require('../');

gulp.task('image', function() {
  gulp.src('./fixtures/*')
    .pipe(image())
    .pipe(gulp.dest('./dest'));
});

gulp.task('default', ['image']);
