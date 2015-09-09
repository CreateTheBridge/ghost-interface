// Load plugins
var gulp = require('gulp'),
    Mincer = require('mincer'),
    mince = require('gulp-mincer'),
    exec = require('child_process').exec,
    plumber = require('gulp-plumber'),
    gutil = require('gulp-util'),
    compass = require('gulp-compass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    clean = require('gulp-rimraf'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload');


// Set up Mincer directive processor
var mincerEnv = new Mincer.Environment();

env.appendPath("source/assets/javascripts");
env.appendPath("source/assets/stylesheets");


gulp.task("clean", function() {
  return gulp.src(["assets/stylesheets/*", "assets/javascripts/*", "assets/images"], { read: false })
    .pipe( clean() );
});

gulp.task("recompile-assets", function() {
  return gulp.src("source/assets/**/application.*")
    .pipe( mince(env) )
    .pipe( gulp.dest("assets") );
});

gulp.task("minify-css", function() {
  return gulp.src("assets/stylesheets/*")
    .pipe( autoprefixer("last 2 version", "safari 5", "ie 8", "ie 9", "opera 12.1", "ios 6", "android 4") )
    .pipe( rename({ suffix: ".min" }) )
    .pipe( minifycss() )
    .pipe( notify({ message: "CSS minified successfully." }) );
});

gulp.task("minify-js", function() {
  return gulp.src("assets/javascripts/*")
    .pipe( uglify() )
    .pipe( rename({ suffix: ".min" }) )
    .pipe( notify({ message: "JavaScript minified successfully." }) );
});

gulp.task("minify-images", function() {
  return gulp.src("source/assets/images/*")
    .pipe( cache( imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }) ) )
    .pipe( gulp.dest("assets/images") )
    .pipe( notify({ message: "Images minifed successfully" }) );
});

gulp.task('generate-favicon', function () {
    (exec('cd source/assets/images/; ruby favicon_maker.rb'));
});

gulp.task("templates", function() {
  return gup.src("*.hbs")
    .pipe(
      plumber( function(error) {
        gutil.log( gutil.colors.red(error.message) );
        this.emit( "end" );
      })
    )
    .pipe( livereload() );
});

gulp.task("watch", function() {
  // Watch stylesheets
  gulp.watch("source/assets/stylesheets/*", ['recompile-assets', 'minify-css']);

  // Watch scripts
  gulp.watch("source/assets/javascripts/*", ['recompile-assets', 'minify-js']);

  // Watch images
  gulp.watch("source/assets/images/*", ['minify-images']);

  // Watch .hbs files
  gulp.watch("*.hbs", ['templates']);


  var server = livereload();
  gulp.watch("assets/**").on("change", function(file) {
    server.changed(file.path);
  });
});

gulp.task("ghost-server", function () {
  exec("cd $GHOST_PATH; npm start");
});

gulp.task("run", function() {
  gulp.start("ghost-server", "watch");
});

gulp.task("default", ['clean'], function() {
  gulp.start('recompile-assets', 'minify-css', 'minify-js', 'minify-images', 'generate-favicon');
});
