var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    watch = require('gulp-watch'),
    sass = require('gulp-sass'),
    mustache = require('gulp-mustache');

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

/*Copy Data*/
gulp.task('copyJSON', function() {
    return gulp.src('source/*.json')
        .pipe(gulp.dest('build'));
});

gulp.task('template', function () {
    return gulp.src("source/*.mustache")
        .pipe(mustache('source/data.json',{},{}))
        .pipe(concat('tweet.html'))
        .pipe(gulp.dest("./build"));
});

gulp.task('updateDocs', function () {
    return gulp.src("build/*.*")
        .pipe(gulp.dest("./docs"));
});

gulp.task('watch', function() {
  gulp.watch('source/js/*.js', ['js']);
  gulp.watch('source/scss/*.scss', ['css']);
  gulp.watch('source/*.html', ['copyHtml']);
  gulp.watch('build/*.*', ['updateDocs']),
  gulp.watch('source/*.mustache', ['template']);
});

gulp.task('default', ['js', 'css', 'copyHtml', 'copyJSON', 'template', 'updateDocs', 'watch']);