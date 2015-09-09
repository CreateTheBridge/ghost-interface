# Ghost Interface Yeoman Generator

Allows generation of asset pipeline enabled Ghost theme development using Interface, a thin UI toolkit created by Create the Bridge.

## Ghost Manager

Ghost Manager is a ruby gem which was created to simplify Ghost installations and theme development. See the github page to learn more about it and how to leverage its power. https://github.com/CreateTheBridge/ghost-manager

## Installation

### With Ghost Manager

Coming soon

### Without Ghost Manager

Generate ghost theme in current directory
```
yo ghost-interface
```

## Usage

### With Ghost Manager

Coming soon

### Without Ghost Manager

First, generate the theme directory using:
```
yo ghost-interface
```

Copy theme folder into $GHOST_PATH/content/themes. To run the development server and use live reload, you'll need to develop from within a Ghost installation.
```
cp -R {{ghost-theme-name}}/ $GHOST_PATH/content/themes/{{ghost-theme-name}} && cd $GHOST_PATH//content/themes/{{ghost-theme-name}}
```

Install required development dependencies
```
npm install
```

Run the ghost server and watch for theme changes
```
gulp run
```

## Theme Commands

Clears all compiled/minified assets
```
gulp clean
```

Build stylesheet assets
```
gulp build-stylesheets
```

Build javascript assets
```
gulp build-javascripts
```

Optimize Images/SVGs
```
gulp optimize-images
```

Generate Favicon
```
gulp generate-favicon
```

Watch for changes in js/css/images/templates and recompile on change
```
gulp watch
```

Start ghost server
```
gulp ghost-server
```

Run the server and watch for asset changes
```
gulp run
```

Recompile and minify assets
```
gulp
```
