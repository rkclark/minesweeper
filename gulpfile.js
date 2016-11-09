var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var cssnano = require('gulp-cssnano');
var del = require('del');
var runSequence = require('run-sequence');

// Development Tasks
// -----------------

//Start browserSync server
gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: 'src'
    },
  })
})

//Process Sass and reload browser
gulp.task('sass', function(){
  return gulp.src('src/scss/main.scss')
    .pipe(sass()) // Using gulp-sass
    .pipe(gulp.dest('src/css'))
    .pipe(browserSync.reload({
      stream: true
      }))
});

//Watch for file changes and reload browser
gulp.task('watch', function(){
  gulp.watch('src/scss/**/*.scss', ['sass']);
  // Reloads the browser when any HTML or JS files change
  gulp.watch('src/*.html', browserSync.reload);
  gulp.watch('src/js/**/*.js', browserSync.reload);
})

// Optimization Tasks
// -----------------

//Concatenate and minify js and css
gulp.task('useref', function(){
  return gulp.src('src/*.html')
    .pipe(useref())
    //Minify js files
    .pipe(gulpIf('*.js', uglify()))
    //Minify css files
    .pipe(gulpIf('*.css', cssnano()))
    .pipe(gulp.dest('dist'))
});

//Move images - opportunity to optimize them here but not currently implemented
gulp.task('images', function(){
  return gulp.src('src/img/**/*.+(png|jpg|gif|svg|ico)')
  .pipe(gulp.dest('dist/img'))
});

//Clean out dist folder for use before building
gulp.task('clean:dist', function() {
  return del.sync('dist');
})

// Build Sequences
// ---------------

//Default task runs development tasks
gulp.task('default', function (callback) {
  runSequence(['sass','browserSync', 'watch'],
    callback
  )
})

//Build process to construct app in dist folder
gulp.task('build', function (callback) {
  runSequence('clean:dist', 'sass',
    ['useref', 'images'],
    callback
  )
})
