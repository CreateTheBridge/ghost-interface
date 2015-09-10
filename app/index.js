'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var chalk = require('chalk');

var GhostInterfaceGenerator = yeoman.generators.Base.extend({
  constructor: function() {
    yeoman.generators.Base.apply(this, arguments);

    this.argument('themeName', { type: String, required: false });
  },

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
    if (this.themeName == undefined || this.themeName == null || this.themeName == '') {
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
    }
  },

  app: function () {
    var baseDir = this.themeName;

    // folders
    this.mkdir(baseDir);
    this.mkdir(baseDir + "/source");

    // Copy assets
    this.directory("app/assets", baseDir + "/source/assets")

    // Copy system files
    this.copy("app/gulpfile.js", baseDir + "/gulpfile.js");
    this.copy("app/package.json", baseDir + "/package.json");
    this.copy("app/bower.json", baseDir + "/bower.json");
    this.copy("app/.bowerrc", baseDir + "/.bowerrc");

    // Copy views
    this.directory("app/views", baseDir + "/source");
  },

  projectfiles: function () {
    var baseDir = this.themeName;

    this.copy("app/.gitignore", baseDir + "/.gitignore");
  }
});

module.exports = GhostInterfaceGenerator;
