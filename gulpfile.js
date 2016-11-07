// Include gulp
var gulp = require('gulp');
// Include plugins
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var sass = require('gulp-ruby-sass');
 // Concatenate JS Files
gulp.task('scripts', function() {
    return gulp.src('src/js/*.js')
      .pipe(concat('app.js'))
      .pipe(rename({suffix: '.min'}))
      .pipe(uglify())
      .pipe(gulp.dest('build/js'));
});
//Process Sass
gulp.task('sass', function() {
    return sass('src/sass/main.scss', {style: 'compressed'})
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('build/css'));
});
//Post process css
// gulp.task('autoprefixer', function () {
//     var postcss      = require('gulp-postcss');
//     var sourcemaps   = require('gulp-sourcemaps');
//     var autoprefixer = require('autoprefixer');
//
//     return gulp.src('./src/*.css')
//         .pipe(sourcemaps.init())
//         .pipe(postcss([ autoprefixer({ browsers: ['last 2 versions'] }) ]))
//         .pipe(sourcemaps.write('.'))
//         .pipe(gulp.dest('./dest'));
// });
//Watch for changes
gulp.task('watch', function() {
   // Watch .js files
  gulp.watch('src/js/*.js', ['scripts']);
   // Watch .scss files
  gulp.watch('src/sass/*.scss', ['sass']);
 });
 // Default Task
gulp.task('default', ['scripts', 'sass', 'watch']);

//https://webdesign.tutsplus.com/tutorials/using-postcss-together-with-sass-stylus-or-less--cms-24591
