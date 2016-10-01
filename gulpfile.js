var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    watch = require('gulp-watch'),
    sass = require('gulp-sass');

/*Build JS Files*/
gulp.task('js', function () {
    return gulp.src('source/js/*.js')
        .pipe(uglify())
        .pipe(concat('zeta.js'))
        .pipe(gulp.dest('build'));
});

gulp.task('css', function () {
    return gulp.src('source/scss/*.scss')
        .pipe(sass())
        .pipe(concat('zeta.css'))
        .pipe(gulp.dest('build'));
});

/*Copy HTML files from source to build*/
gulp.task('copyHtml', function() {
    return gulp.src('source/*.html')
        .pipe(gulp.dest('build'));
});

gulp.task('watch', function() {
  gulp.watch('source/js/*.js', ['js']);
  gulp.watch('source/scss/*.scss', ['css']);
  gulp.watch('source/*.html', ['copyHtml']);
});

gulp.task('default', ['js', 'css', 'copyHtml', 'watch']);