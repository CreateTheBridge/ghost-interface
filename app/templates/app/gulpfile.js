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
    uncss = require('gulp-uncss'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    clean = require('gulp-rimraf'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    rsync = require('gulp-rsync'),
    favicons = require('gulp-favicons/es5'),
    livereload = require('gulp-livereload');


// Set up Mincer directive processor
var env = new Mincer.Environment();
env.appendPath("source/assets/bower_components");
env.appendPath("source/assets/javascripts");
env.appendPath("source/assets/stylesheets");



var buildDirectory = "<%= buildDir %>";


gulp.task("nuke-javascript", function() {
  return gulp.src(buildDirectory + "/assets/javascripts")
    .pipe( clean({ force: true }) );
});

gulp.task("nuke-stylesheets", function() {
  return gulp.src(buildDirectory + "/assets/stylesheets")
    .pipe( clean({ force: true }) );
});

gulp.task("nuke-images", function() {
  return gulp.src(buildDirectory + "/assets/images")
    .pipe( clean({ force: true }) );
});

gulp.task("nuke-templates", function() {
  return gulp.src(buildDirectory + "/**/*.hbs")
    .pipe( clean({ force: true }) );
});

gulp.task("build", ["package", "javascript", "stylesheets", "templates", "images"]);

gulp.task("favicons", ["nuke-images"], function() {
  return gulp.src("source/assets/images/favicon_base.png")
    .pipe( favicons({
      appName: "Ghost Interface",
      appDescription: "Ghost Interface Boilerplate",
      developerName: "Create the Bridge",
      developerURL: "http://www.createthebridge.com",
      background: "#020307",
      path: "/assets/images",
      url: "http://localhost:2368",
      display: "standalone",
      orientation: "portrait",
      version: 1.0,
      logging: false,
      online: false,
      html: "./source/partials/favicons.hbs",
      replace: true
    }))
    .pipe( gulp.dest(buildDirectory + '/assets/images') );
});

gulp.task("javascript", ["nuke-javascript"], function() {
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
    .pipe( gulp.dest(buildDirectory + "/assets/javascripts") )
    .pipe( livereload() );
});

gulp.task("stylesheets", ["nuke-stylesheets"], function() {
  return gulp.src("source/assets/stylesheets/application.*")
    .pipe( mince(env) )
    .pipe( autoprefixer({ browsers: ['last 2 version'] }) )
    .pipe(
      rename(function(path) {
        var pieces = path.basename.split('.');
        path.basename = pieces[0] + ".min";
        path.extname = "." + pieces[1];
      })
    )
    .pipe( minifycss() )
    .pipe( gulp.dest(buildDirectory + "/assets/stylesheets") )
    .pipe( livereload() );
});

gulp.task("templates", ["nuke-templates"], function() {
  return gulp.src("source/**/*.hbs")
    .pipe( gulp.dest(buildDirectory) )
    .pipe( livereload() );
});

gulp.task("images", ["nuke-images"], function() {
  return gulp.src("source/assets/images/**")
    .pipe( gulp.dest(buildDirectory + "/assets/images") )
    .pipe( livereload() );
});

gulp.task("package", function() {
  return gulp.src("package.json")
    .pipe( gulp.dest(buildDirectory) );
});

gulp.task("default", ["build"], function() {
  livereload.listen();

  gulp.watch(["source/assets/javascripts/**"], ["javascript"]);
  gulp.watch(["source/assets/stylesheets/**"], ["stylesheets"]);
  gulp.watch(["source/assets/images/**"], ["images"]);
  gulp.watch(["source/**/*.hbs"], ["templates"]);
  gulp.watch(["package.json"], ["package"]);

  var ghost = require('ghost');
	process.env.NODE_ENV = 'development';
	ghost({ config: __dirname + '/ghostfile.js' }).then(function (ghostServer) {
		ghostServer.start();
	});
});



// Production stuff

gulp.task("nuke-prod", function() {
  return gulp.src("build")
    .pipe( clean() );
});

gulp.task("javascript-prod", ["nuke-prod"], function() {
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

gulp.task("stylesheets-prod", ["nuke-prod"], function() {
  return gulp.src("source/assets/stylesheets/application.*")
    .pipe( mince(env) )
    .pipe( autoprefixer({ browsers: ['last 2 version'] }) )
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

gulp.task("images-prod", ["nuke-prod"], function() {
  return gulp.src("source/assets/images/**")
    .pipe( gulp.dest("build/assets/images") );
});

gulp.task("templates-prod", ["nuke-prod"], function() {
  return gulp.src("source/**/*.hbs")
    .pipe( gulp.dest("build") );
});

gulp.task("favicon-prod", ["nuke-prod"], function() {
  return gulp.src("source/assets/images/favicon_base.png")
    .pipe( favicons({
      appName: "Ghost Interface",
      appDescription: "Ghost Interface Boilerplate",
      developerName: "Create the Bridge",
      developerURL: "http://www.createthebridge.com",
      background: "#020307",
      path: "build/assets/images",
      url: "http://localhost:2368",
      display: "standalone",
      orientation: "portrait",
      version: 1.0,
      logging: false,
      online: false,
      html: "./build/partials/favicons.hbs",
      replace: true
    }))
    .pipe( gulp.dest('build/assets/images') );
});

gulp.task("prod", ["javascript-prod", "stylesheets-prod", "images-prod", "templates-prod", "favicon-prod"], function() {
  return gulp.src("package.json")
    .pipe( gulp.dest("build") );
});
