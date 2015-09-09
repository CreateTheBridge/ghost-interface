# Ghost Interface Yeoman Generator

Allows generation of asset pipeline enabled Ghost theme development using Interface, a thin UI toolkit created by Create the Bridge.

## Ghost Manager

Ghost Manager is a ruby gem which was created to simplify Ghost installations and theme development. See the github page to learn more about it and how to leverage its power. https://github.com/CreateTheBridge/ghost-manager

## Instalaltion - With Ghost Manager

Coming soon

## Installation - Without Ghost Manager

Generate ghost theme in current directory
```
yo ghost-interface
```

## Usage - With Ghost Manager

Coming soon

## Usage - Without Ghost Manager

First, generate the theme directory using:
```
yo ghost-interface
```

Move into the generated theme directory:
```
cd {{theme name}}/
```

Install dependencies using npm:
```
npm install
```

Make sure the environemnt variable $GHOST_PATH is set to the install directory of ghost.
For example, /Users/joshuat/Applications/Ghost <- Contains my ghost files. https://github.com/TryGhost/Ghost
```
GHOST_PATH=~/Applications/Ghost
```

Run the ghost server and watch for theme changes
```
gulp run
```

## Theme Commands

```
yo ghost-interface
```

Clears all compiled/minified assets
```
gulp clean
```

Generates assets
```
gulp recompile-assets
```

Minify JS
```
gulp minify-js
```

Minify CSS
```
gulp minify-css
```

Optimize Images/SVGs
```
gulp minify-images
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
