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
    livereload = require('gulp-livereload');


// Set up Mincer directive processor
var env = new Mincer.Environment();

env.appendPath("source/assets/javascripts");
env.appendPath("source/assets/stylesheets");

var argv = yargs.argv;

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
  return gulp.src("source/**/*.hbs")
    .pipe(
      plumber( function(error) {
        gutil.log( gutil.colors.red(error.message) );
        this.emit( "end" );
      })
    )
    .pipe( gulp.dest("./") )
    .pipe( livereload() );
});

gulp.task("templates-no-reload", function() {
  return gulp.src("source/**/*.hbs")
    .pipe(
      plumber( function(error) {
        gutil.log( gutil.colors.red(error.message) );
        this.emit( "end" );
      })
    )
    .pipe( gulp.dest("./") );
});

gulp.task("watch", function() {
  // Watch stylesheets
  gulp.watch("source/assets/stylesheets/*", ["build-stylesheets"]);

  // Watch scripts
  gulp.watch("source/assets/javascripts/*", ["build-javascripts"]);

  // Watch images
  gulp.watch("source/assets/images/*", ["optimize-images"]);

  // Watch .hbs files
  gulp.watch("source/**/*.hbs", ['templates']);

  var server = livereload();
  gulp.watch(["assets/**", "**/*.hbs"]).on("change", function(file) {
    server.changed(file.path);
    if (argv.path != undefined && argv.path != null && argv.path != '') {
      var filename = file.path.replace(/^.*[\\\/]/, '')
      var message = "Syncing " + filename + " - " + file.type;
      gutil.log( gutil.colors.green(message) );

      gulp.src(["assets/**", "**/*.hbs"])
        .pipe( gulp.dest(argv.path) );
    }
  });
});

gulp.task("ghost-server", function () {
  if (argv.ghost != undefined && argv.ghost != null && argv.ghost != '') {
    (exec("cd " + argv.ghost + "; npm start"));
  } else {
    (exec("cd ../../../; npm start"));
  }
});

gulp.task("run", function() {
  gulp.start("ghost-server", "watch");
});

gulp.task("default", ['clean'], function() {
  gulp.start("build-stylesheets", "build-javascripts", "templates-no-reload");
});
