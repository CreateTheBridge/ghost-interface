// Load plugins
var gulp = require('gulp'),
    Mincer = require('mincer'),
    mince = require('gulp-mincer'),
    exec = require('child_process').exec,
    plumber = require('gulp-plumber'),
    gutil = require('gulp-util'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    clean = require('gulp-rimraf'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload');


// Set up Mincer directive processor
var env = new Mincer.Environment();

env.appendPath("source/assets/javascripts");
env.appendPath("source/assets/stylesheets");


gulp.task("clean", function() {
  return gulp.src(["assets/stylesheets/*", "assets/javascripts/*", "assets/images"], { read: false })
    .pipe( clean() );
});

gulp.task("build-javascripts", function() {
  return gulp.src("source/assets/javascripts/application.*")
    .pipe( mince(env) )
    .pipe(
      rename(function(path) {
        var pieces = path.basename.split('.');
        path.basename = pieces[0] + ".min";
        path.extname = "." + pieces[1];
      })
    )
    .pipe( uglify() )
    .pipe( gulp.dest("assets/javascripts") )
    .pipe( notify({ message: "Javascripts built successfully" }) );
});

gulp.task("build-stylesheets", function() {
  return gulp.src("source/assets/stylesheets/application.*")
    .pipe( mince(env) )
    .pipe(
      rename(function(path) {
        var pieces = path.basename.split('.');
        path.basename = pieces[0] + ".min";
        path.extname = "." + pieces[1];
      })
    )
    .pipe( minifycss() )
    .pipe( gulp.dest("assets/stylesheets") )
    .pipe( notify({ message: "Stylesheets built successfully" }) );
});

gulp.task("optimize-images", function() {
  return gulp.src("source/assets/images/*")
    .pipe( cache( imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }) ) )
    .pipe( gulp.dest("assets/images") )
    .pipe( notify({ message: "Images optimized successfully" }) );
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
  gulp.watch("source/assets/stylesheets/*", ["build-stylesheets"]);

  // Watch scripts
  gulp.watch("source/assets/javascripts/*", ["build-javascripts"]);

  // Watch images
  gulp.watch("source/assets/images/*", ["optimize-images"]);

  // Watch .hbs files
  gulp.watch("*.hbs", ['templates']);


  var server = livereload();
  gulp.watch("assets/**").on("change", function(file) {
    server.changed(file.path);
  });
});

gulp.task("ghost-server", function () {
  (exec("cd ../../../; npm start"));
});

gulp.task("run", function() {
  gulp.start("ghost-server", "watch");
});

gulp.task("default", ['clean'], function() {
  gulp.start("build-stylesheets", "build-javascripts");
});
