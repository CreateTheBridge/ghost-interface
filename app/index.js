'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var chalk = require('chalk');

var GhostInterfaceGenerator = yeoman.generators.Base.extend({
  init: function () {
    this.pkg = require('../package.json');

    this.on('end', function () {
      if (!this.options['skip-install']) {
          var baseDir = this.themeName;
          this.spawnCommand("npm", ["install"], { cwd: baseDir});
          this.spawnCommand("bower", ["install"], { cwd: baseDir})
      }
    });
  },

  askFor: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(this.yeoman);

    // replace it with a short and sweet description of your generator
    this.log(chalk.magenta('Welcome to the Ghost Interface generator from Create the Bridge!'));

    var prompts = [{
      name: 'themeName',
      message: 'What do you want to call your theme?',
      default: 'new-ghost-theme'
    }];

    this.prompt(prompts, function (props) {
      this.themeName = props.themeName;

      done();
    }.bind(this));
  },

  app: function () {
    var baseDir = this.themeName;
    this.mkdir( baseDir );

    // Copy entire app dir to source
    this.directory("app", baseDir + "/source");

    // folders
    this.mkdir(baseDir+'/assets');
    this.mkdir(baseDir+'/assets/stylesheets');
    this.mkdir(baseDir+'/assets/javascripts');
    this.mkdir(baseDir+'/assets/images');
    this.mkdir(baseDir+'/partials');

    // handlebars templates
    this.copy("app/views/layout.hbs", baseDir + "/default.hbs");
    this.copy("app/views/index.hbs", baseDir + "/index.hbs");
    this.copy("app/views/post.hbs", baseDir + "/post.hbs");
    this.copy("app/views/page.hbs", baseDir + "/page.hbs");
    this.copy("app/views/tag.hbs", baseDir + "/tag.hbs");
    this.copy("app/views/author.hbs", baseDir + "/author.hbs");
    this.copy("app/views/partials/loop.hbs", baseDir + "/partials/loop.hbs");
    this.copy("app/views/partials/navigation.hbs", baseDir + "/partials/navigation.hbs");

    // Copy theme files
    this.copy("app/gulpfile.js", baseDir + "/gulpfile.js");
    this.copy("app/package.json", baseDir + "/package.json");
    this.copy("app/bower.json", baseDir + "/bower.json");
    this.copy("app/.bowerrc", baseDir + "/.bowerrc");
  },

  projectfiles: function () {
    var baseDir = this.themeName;

    this.copy("app/.gitignore", baseDir + "/.gitignore");
  }
});

module.exports = GhostInterfaceGenerator;
