# Ghost Interface Yeoman Generator

Allows generation of asset pipeline enabled Ghost theme development using Interface, a thin UI toolkit created by Create the Bridge.

## Ghost Manager

Ghost Manager is a ruby gem which was created to simplify Ghost installations and theme development. See the github page to learn more about it and how to leverage its power. https://github.com/CreateTheBridge/ghost-manager

We recommend using Ghost Manager to do theme development with Ghost. It allows usage of SASS and CoffeScript, which is the preferred method of CSS/JS development.

## Installation

Generate ghost theme in current directory
```
yo ghost-interface
```

Optionally, you can pass the name of the theme directly to the command line
```
yo ghost-interface {{theme-name}}
```

## Usage

Generate the theme directory using:
```
$ yo ghost-interface
```

Move into the theme directory
```
$ cd theme-name/
```

Install required development dependencies
```
npm install
```

Run the ghost server and watch for theme changes
```
gulp server
```

## Gulp Commands

**Command**: gulp clean

**Description**: Cleans out the build/ directory

```
$ gulp clean
```

**Command**: gulp rebuild

**Description**: Recompiles SASS/CoffeeScript, optimizes images, copies all required files to the build/ directory. After build is complete, it rsyncs the content to the remote theme folder.

**Arguments**:
+ (optional) --path {{path}} | Specifies the remote path which to sync the built theme files.

```
$ guild rebuild --path /Users/joshuat/Applications/Ghost/content/themes/magneto
```

**Command**: gulp server

**Description**: Runs the Ghost server and watches the source files for changes.

**Arguments**:
+ (optional) --ghost {{path}} | The absolute path of the ghost installation, assumes ../../../ if no path is specified
+ (optional) --path {{path}} | The remote path of the theme files to sync with.

```
$ gulp server --ghost /Users/joshuat/Applications/Ghost --path /Users/joshuat/Applications/Ghost/content/themes/magneto
```

## Contributing

Bug reports and pull requests are welcome on GitHub at https://github.com/CreateTheBridge/generator-ghost-interface.


## License

The gem is available as open source under the terms of the [MIT License](http://opensource.org/licenses/MIT).
