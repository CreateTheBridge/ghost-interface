// Load plugins
var gulp = require('gulp'),
    yargs = require('yargs'),
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
    rsync = require('gulp-rsync'),
    livereload = require('gulp-livereload');


// Set up Mincer directive processor
var env = new Mincer.Environment();
env.appendPath("source/assets/javascripts");
env.appendPath("source/assets/stylesheets");

var argv = yargs.argv;

// Set up the server path
var server_path = "../../../";
if (argv.ghost != undefined && argv.ghost != null && argv.path != '') {
  server_path = argv.ghost;
}

// Set up the path we're dropping build files in when we're done
var sync_destination = __dirname;
if (argv.path != undefined && argv.path != null && argv.path != '') {
  sync_destination = argv.path;
}

gutil.log(sync_destination);


gulp.task("clean", function() {
  return gulp.src("build")
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
    .pipe( gulp.dest("build/assets/javascripts") );
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
    .pipe( gulp.dest("build/assets/stylesheets") );
});

gulp.task("build-templates", function() {
  return gulp.src("source/**/*.hbs")
    .pipe( gulp.dest("build") );
});

gulp.task("rebuild", ["build-javascripts", "build-stylesheets", "build-templates"], function() {
  return gulp.src("build/**")
    .pipe( rsync({ root: 'build', destination: sync_destination }) );
});

gulp.task("server", ["rebuild", "watch"], function() {
  exec("cd " + server_path + "; npm start");
});

gulp.task("watch", function() {
  gulp.watch([
    "source/assets/**",
    "source/views/**"
  ], ["rebuild"]);
});

gulp.task("default", function() {
  gulp.start("rebuild");
});
