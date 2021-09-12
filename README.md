# Creating a React App from scratch - Webpack@5, TypeScript@4+, React@16+

## Intro

As a react developer you are probably familiar with CRA (Create React App) and how easy it is to spin up a react app and to get going writing react apps.  However CRA does come with some drawbacks.  Here are a few:

- It becomes difficult to have multiple build outputs for multiple environments.  For example, you can add env files that allow you to access an environment in your app code, but if you want to control it in the build flow you basically need to eject the app or start leveraging config override depedencies.

- CRA uses older versions of many packages and doesn’t stay up to date with new versions as quickly as they become production ready (as of writing this, CRA is still on webpack 4.41.2 despite version 5 having been out for 10+ months.)

- You can't use import aliases for paths, like ```import { ITruck, ICar, IVehicle } from '@models'``` easily.  It's possible to use a tsconfig's paths section combined with an eslint plugin and a webpack plugin to use them in all 3 contexts (type script design time, webpack compile time, and eslint design time.)  Thus enabling all contexts to use your path aliases.  Having this kind of control over the configs and plugins needs an ejected react app.

- Developers using CRA are relying on CRA and don't necessarily know how to fix anything should they ever be forced to eject a CRA based app.  There is a lot of value in understanding the tools CRA uses to allow you to write react apps.  For example, you can leverage yarn to temporarily apply a patch if you encounter a bug in a depedency allowing you to continue on while the bug is fixed by plugin authors.

> It is worth noting here that webpack 5 has breaking changes with webpack 4, which is likely holding CRA back from upgrading to WebPack 5, which is another supporting reason to roll your own if you want to take advantage of the latest features in the most recent webpack.  If you want to know what's new in Webpack 5 and why you might care to be using it you can refer to the release notes from webpack.js.org here: https://webpack.js.org/blog/2020-10-10-webpack-5-release/

Aside from the drawbacks to using CRA, maybe you just want to better understand the tools you are using and how they work.  In this article I’m going to show you how to start from an empty command line, using VSCode, and Node.js to create a Hello World React app in Typescript while having configured it from scratch.  I will also link you to resources covering each depedency.

> I'm going to go ahead and assume you already have vscode and node.js installed and know how to operate VSCode.  
I'm also going to assume you have the latest version of npm installed, if not, upgrade it with `npm install -g npm@latest` as this can cause issues if you are running on a really old version of npm despite having installed a new node.

-----------

## Initializing your node project

**The first command we'll run is:**

```node
npm init 
```

This command initialized your project so it'll have a package.json with some defaults setup.  You can walk through the prompt and choose whatever you feel is appropriate for settings, just take the defaults if you want.

-----------

## Installing Yarn

> Now let's install yarn, as we'll be using it for all farther package depedency installs from this point forward.  If you're curious about yarn you can check out the documentation here: https://classic.yarnpkg.com/en/docs

**Run the following command:**

``` node
npm install -g yarn 
```

## Installing SCSS and PostCss

> We'll use these in this tutorial for doing our CSS in SCSS and using post css for auto prefixer

**Run the following command:**

``` node
yarn add -D postcss sass@1.32 postcss-preset-env autoprefixer
```

>note, we're using sass@1.32 here because the latest version of sass has deprecated warnings to prep scss authors for breaking changes in sass@2.0.0 and some libraries like font-awesome haven't updated their use of the / (division) operator to the new math library yet.  So to not get spammed with deprecation warnings
in this project I have stopped at the last sass version before the warnings were added.  If you don't need SASS this is irrelevant.  If none of your depedencies use / operator for division in their scss files then you can use the latest version without getting spammed with deperecated warnings from the libraries.

**Add the post css config to your package.json by adding it as a new root level property in the json:**

``` JSON
  "postcss": {
    "plugins": {
      "autoprefixer": {},
      "postcss-preset-env": {
        "browsers": "last 2 versions",
        "stage": 0
      }
    }
  }
```

**note this tells postcss to use autoprefixer for the last 2 major browser versions, you might want to edit your browser targets to suit your needs.**

**For more details check out the post css documentation:** https://github.com/postcss/postcss

## Installing WebPack

Now let's start diving into the first depedencies for building a react app with WebPack version 5+ **(the latest version)**.  For a reference to webpack you can visit their website: https://webpack.js.org/concepts/

``` node
yarn add -D webpack@latest webpack-cli
```

### Installing Webpack plugins we'll use in this tutorial

| Plugin Name |  Usage  |
| ----------- | ---------- |
| tsconfig-paths-webpack-plugin | used to resolve imports from tsconfig path aliases |
| sass-loader | used to process Syntactically Awesome Style Sheets |
| postcss-loader | used to post process css files to apply auto prefixer |
| css-loader | used to process css to be output |
| style-loader | used to inject css to the page |
| terser-webpack-plugin | used to minify assets |
| html-webpack-plugin | used to tell webpack to generate an index.html for our project from a template html file |
| webpack-dev-server | used to run our react app locally with hot module reloading |

**Next: install the plugins by running following command:**

``` node
yarn add -D tsconfig-paths-webpack-plugin sass-loader postcss-loader css-loader style-loader terser-webpack-plugin html-webpack-plugin webpack-dev-server
```

## Installing Babel

Next we're going to add all the babel depedencies, we are going to write our webpack config file using babel.  We are going to use all the latest versions of babel.  You can checkout babel at their website: https://babeljs.io/docs/en/  For a short explanation of babel: It is a javascript transpiler that will compile our typescript for us and handle polyfilling for browser targets and making sure compiled JS is compatible with those browser targets.

**Run the following command to install the babel depedencies:**

``` node
yarn add -D @babel/core babel-loader @babel/register @babel/preset-env @babel/preset-typescript @babel/preset-react core-js@3
```

> So what is all this stuff?

...

>Babel is a transpiler for JS, so you just installed the core of babel, babel register, preset-env, and core-js version 3+.  Babel Register allows babel to hook into node's require resolution allowing you to load babel scripts with the .babel.js extension inside of node scripts that will get transpiled by babel.  This enables you to do exports/imports etc in npm scripts.  Preset-env is a set of defaults for how to transpile JS through babel using the latest core-js.  Core-JS contains a slew of polyfills and other standards to ensure your JS will run on your target browsers.  I.e. if you target IE11 and write Javascript that doesn't support IE11 Preset-env will handle pulling in the appropriate poly fills from core-js for you and transpiling your Javascript in a way where it will work on Internet Explorer 11.

**Now add babel config to your package.json (these prevents throwing another file in your source):**

``` JSON
  "babel": {
    "presets": [
      [
        "@babel/preset-env",
        {
          "targets": {
            "node": "current"      
          },
          "corejs": "3",
          "useBuiltIns": "usage"
        }
      ]
    ]
  }
```

**note, this is mainly to tell babel how to be used in node.js scripts like our build files, we'll redefine how babel should be used on the typescript loader in the webpack config when we get there.**

## Installing Typescript

>Next lets install typescript
**Run the following command:**

``` node
yarn add -D typescript
```

**Now let's create a tsconfig.json in the root of the project and setup some compiler options... we'll use the following contents for tsconfig.json:**

``` json
{
    "compilerOptions": {
        "target": "ES2019",
        "lib": [
            "dom",
            "dom.iterable",
            "esnext"
        ],
        "allowJs": true,
        "allowSyntheticDefaultImports": true,
        "skipLibCheck": true,
        "esModuleInterop": true,
        "strict": true,
        "baseUrl": "./src",
        "rootDir": "./src",
        "alwaysStrict": true,
        "forceConsistentCasingInFileNames": true,
        "moduleResolution": "node",
        "resolveJsonModule": true,
        "isolatedModules": true,
        "noEmit": true,
        "jsx": "react",
        "paths": {
            "@routes/*": [
                "routes/*"
            ]

        }
    },
    "include": [
        "src"
    ]
}
```

> The tsconfig.js configures how typescript will behave in the project, you can make it as strict as you want it to be.  For a full list of options check the documentation here: https://www.typescriptlang.org/tsconfig...

For now I've told it to use ES2019 for a target, allowJs is true which allows you to write js... But most important here is that noEmit is true.  So we're not going to have type script output anything here.  Instead we're using typescript as a middle man in the babel pipeline, and babel will transpile our typescript for us.  Additionally I've set the root directory and baseUrl to ./src and setup a path alias for @routes which I'll get to later in this documentaiton.

## Installing ESLint

> Now let's install eslint for the linter and typescript and the react plugin for eslint
> run the following command

``` node
yarn add -D eslint typescript-eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-import-resolver-typescript eslint-plugin-react
```

> Note* We went ahead and grabbed the typescript stuff we need to make eslint work with typescript and a plugin for react for eslint in this step, we'll set them up later.

### Configuring ESLint

ESLint Documentation: https://eslint.org/docs/user-guide/configuring/

Next we'll set up the configuration file for eslint to use typescript and add a rule.  You can add as many rules as you want, there's an entire list of available rules for ESLint here: https://eslint.org/docs/rules/

The purpose of the linter is to give you helpful warnings and or errors about your typescript and javascript as you write it.  You can use eslint to enforce
code standards and writing code a specific way.

>Edit your package json and add the following section to your package.json (this prevents having to have it as a root file in the project .. i.e. eslintrc.json)

**note take out all the comments, they are not compatible with json:**

``` JSON
  "eslintConfig":
    "root": true,     
    "parser": "@typescript-eslint/parser", //tells eslint to use typescript parser
    "plugins": [
      "import",
      "@typescript-eslint"  //tells eslint to use typescript eslint
    ],
    "parserOptions": {
      "ecmaVersion": 2019, //which version of ecma to target
      "sourceType": "module",
      "ecmaFeatures": {
        "jsx": true //enables jsx linting
      }
    },
    "rules": {
      "import/no-unresolved": "error" //all the rules for the linter to enforce and whether to error out or warn
    },
    "settings": {
      "import/parsers": {
        "@typescript-eslint/parser": [".ts", ".tsx"] //configure which file extensions the typescript linter will process for imports
      },
      "import/resolver": {
        "typescript": {
          "alwaysTryTypes": true 
        }
      }
    },
    "extends": [
      "eslint:recommended",
      "plugin:@typescript-eslint/eslint-recommended",
      "plugin:@typescript-eslint/recommended"
    ]
  }
```

## Setting up the project folder structure

> Now let's create a folder structure in our project to support the webpack build we're getting ready to make.  I have used a very basic example here, but one of the  points of this is your folder structure can be whatever you want it to be.

**Add the following folders and files:**

- build
  - config
    - paths.js
    - webpack
      - baseWebPackConfig.js
      - local.webpack.config.babel.js
    - htmlTemplates
      - local.index.html
- dst
- src
  - assets
    - scss
      - app.scss
      - vendor.scss
  - routes
    - home
      - Home.tsx
  - components
    - HelloWorld.tsx
    - index.tsx

## Filling out the configurations

### build\config\paths.js

> To start with, let's create a helper for calculating our paths in the build\config\paths.js file.  It should look like this:

**FileName: build\config\paths.js:**

``` Javascript
import path from 'path'; //path library from node.js

function paths() {
    this.root = path.resolve(path.join(__dirname));
    this.src = path.join(root, 'src');
    this.srcIndexEntry = path.join(this.src, 'index.tsx');
    this.srcAssets = path.join(this.src, 'assets');
    this.srcAssetsScss = path.join(this.src, 'scss');
    this.srcAssetsScssEntry = path.join(this.srcAssetsScssEntry);
    
    this.dst = path.join(this.root, 'dist');
    this.dstVendor = path.join(this.dst, 'vendor');
}

export default new paths();
```

> note: you can add more as you need to the paths.js file.  The goal is that you should edit all your paths here and not put them in your main webpack config files which will make it easier to change paths used through the config files if you move file or folder structures around later.  (something you can't easily do with CRA).

### build\webpack.config.babel.js

>Now let's start creating our webpack configuration.... You can refer to the documentation here to understand this file more: https://webpack.js.org/configuration/#options  but basically the webpack.config is what tells webpack what to do.  It's where you define your entry point (index.js for example) for your application and how it should be output.  You can also add a slew of plugins like the HtmlWebpackPlugin which can generate your index.html with your bundles in it for you so you never have to update your script links manually.    We will be installing some more plugins for webpack as we proceed.

**Create a file in the build/webpack folder called baseWebPackConfig.js:**
> We'll put the bulk of the logic for webpack here so it can be used in specific environment based builds, and we'll start with just doing one for our local environment.

In your baseWebPackConfig.js go ahead and add the following contents:

``` Javascript
import paths from '../config/paths'; //*our helper paths config so we don't do path calcs in here*
//plugins for webpack
import HtmlWebpackPlugin from 'html-webpack-plugin'; //docs -> https://webpack.js.org/plugins/html-webpack-plugin/
import tsConfigPathPlugin from 'tsconfig-paths-webpack-plugin'; //docs -> https://www.npmjs.com/package/tsconfig-paths-webpack-plugin
import TerserPlugin from 'terser-webpack-plugin'; //docs -> https://github.com/webpack-contrib/terser-webpack-plugin
import sass from 'sass'; //docs -> https://sass-lang.com/install


//separate so we can call it differently pending on build environment
//This function will compute the array of plugins we want to use for the web pack build being executed.
function getPlugins(env) {
    const htmlWebPackPlugin = new HtmlWebpackPlugin({
        title: 'Your App Name Here',
        fileName: 'index.html', //you can set whatever filename you want here, i.e. index.php if you wanted to generate a php file that will be served by an existing php app.
        template: paths.buildHtmlTemplatesLocalIndex, //this points to our htmlTemplate in the build folder
        inject: 'body', //tell html webpack plugin where to inject scripts, body places them at end of body
        publicPath: '/', //tells the html file to generate script links such as href="/app.js" so they'll load from the root (note: In production you might want absolute urls so you would override this in an environment based config by moving this to paths.js as a config option.)
        scriptLoading: 'blocking', //this is an SPA so we'll block, but you might want to defer for your use case
        hash: true,
        cache: true,
        showErrors: true
    });
    return [
        htmlWebPackPlugin
    ]
}

//separate function to get the config so we can call it from environment based config files.
export function getBaseWebPackConfig(env, argv) {
    let config = {};
    config.mode = 'development'; //we'll set the mode here, you could set this differently pending on the value of env or argv being passed in from command line
    const isLocalDev = argv.env.localdev ? true : false;

    //get the plugins from our getPlugins helper
    config.plugins = getPlugins(env);

    //read up on code splitting, you can use this entry object to define your app as separate entry chunks that depend on each other to optimize
    //how webpack generates your bundle.
    config.entry = {
        //here we are defining two entries which will be separate chunks and we are telling webpack 
        //that the app entry depends on the vendor entry.
        //we'll configure our vendor styles (bootstrap/overrides etc to be output in a separate chunk)
        vendor: {
            import: paths.srcScssVendorEntry
        },
        app: {
            import: paths.srcIndexEntry,
            dependOn: 'vendor'
        }
    }

    config.output = {
        filename: '[name].[contenthash].js', //we have more than one chunk, so we want webpack to output based on the chunks name (app or vendor) and it's content hash
        //the content hash will change when the files content changes
        path: paths.dst, //this tells webpack where to output the files, here we're using the path we calculating in our config paths helper
        clean: true, //this tells webpack to clean the output path first, so if the files exist they'll be cleaned up first.
        assetModuleFilename: 'assets/[name][ext]' //make assets have friendly names
    }


    config.resolve = {
        extensions: [".scss", ".js", ".jsx", ".tsx", ".ts"],
        plugins: [
            new tsConfigPathPlugin() //this is the third final piece to using tsConfig as a source of truth for path aliases, it tells webpack to use it to resolve aliases in our actual code during compilation.
        ]
    }


    //rules tell webpack what to do on specific tests, so 
    //we need to tell webpack what to do when it's processing a type script file
    //or a scss file or an image, etc etc etc.
    config.module = {
        rules: [
            {
                test: /\.(js|ts)x?$/i, //here we define a regex that will run on all ts or js files with tsx or jsx.
                exclude: /[\\/]node_modules[\\/]/, //we tell the loader to ignore node_modules, we will split all node modules out in the vendor chunk
                use: [
                    {
                        loader: 'babel-loader', //use the babel loader
                        options: {
                            presets: [
                                '@babel/preset-env', //use presets for env, react, and typescript
                                '@babel/preset-react',
                                '@babel/preset-typescript'
                            ]
                        }
                    },
                    {
                        loader: 'source-map-loader',
                        options: {

                        }
                    }
                ]
            },
            {
                //this is another webpack 5 feature you don't get with CRA on webpack 4.  It can automatically pull any 
                //files we reference and spit them out as assets in the output folder.  In webpack 4 you had to use file loader, url loader, and so on
                //no more with webpack 5, much simpler.
                test: /\.(woff(2)?|ttf|eot|svg|jpg|jpeg|png|gif|pdf)(\?v=\d+\.\d+\.\d+)?$/, //here we tell webpack that all fonts, images, pdfs are are asset/resource
                type: 'asset/resource'
            },
            {
                test: /\.(scss|sass)$/, //tell webpack how to process scss and sass files
                include: [
                    paths.src,
                    paths.nodemodules //our vendor files etc will resolve files from node_modules so we need to tell webpack sass to include node_modules
                ],
                use: [ //use tells this rule what loaders to use, loaders are used in a last to first order.  So the last loader is processed first, then the loader above it, till the first loader.
                    {
                        //note, in production you should use a css extractor here instead but extracting css is slow so using style-loader is much faster in development
                        loader: 'style-loader', // docs -> https://webpack.js.org/loaders/style-loader/
                        options: {
                            esModule: false,
                            insert: 'head'
                        }
                    },
                    {
                        loader: 'css-loader', //docs -> https://www.npmjs.com/package/css-loader
                        options: {
                            modules: false, //disable modules, this build isn't using styled components in react
                            esModule: false,  //disable es module syntax
                            sourceMap: true //Enables/Disables generation of source maps
                        }
                    },
                    {
                        loader: 'postcss-loader', //docs -> https://github.com/webpack-contrib/postcss-loader
                        options: {
                            sourceMap: true
                        }
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true,
                            implementation: sass
                        }
                    }
                ]
            }
        ]
    }

    //you have control over optimization here, i.e. you can tell webpack
    //how to split chunks and can create test functions for say CSS so css get's extracted to it's own chunk.
    config.optimization = { // these are the defaults from  //docs -> https://webpack.js.org/plugins/split-chunks-plugin/#defaults
        splitChunks: {
            chunks: 'async',
            minSize: 20000,
            minRemainingSize: 0,
            minChunks: 1,
            maxAsyncRequests: 30,
            maxInitialRequests: 30,
            enforceSizeThreshold: 50000,
            cacheGroups: {
                defaultVendors: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10,
                    reuseExistingChunk: true,
                },
                default: {
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: true,
                },
            },
        },
    }


    //only run the dev server if we're in local dev passed in from command line args.
    if (isLocalDev) {
        console.log('DEV SERVER');
        config.devtool = 'eval-source-map';
        config.devServer = {
            historyApiFallback: true,
            hot: true, //turns on hot module reloading capability so when we change src it reloads the module we changed, thus causing a react rerender!
            port: 9000,
            client: {
                progress: true,
                overlay: true,
                logging: 'info' //give us all info logged to client when in local dev mode
            },
            static: {
                publicPath: '/',
                directory: paths.dst
            }
        }
    } else {
        config.devtool = 'source-map';
    }

    return config;
}
```

## Adding the local webpack config

We can specify an html template for webpack to use to generate the html for our SPA.  You can add w/e you want to the template, webpack will
inject all of the necessary scripts and styles etc into this html file when it builds.

**Now add a file to build\htmlTemplates called local.index.html and add the following content:**

``` Html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta http-equiv="Cache-control" content="no-cache, no-store, must-revalidate">
  <meta http-equiv="Pragma" content="no-cache">
  <link rel="shortcut icon" href="data:image/x-icon;," type="image/x-icon">
</head>
<body >
  <div id="appMainBody"></div>
</body>
</html>
```

## Add the environment specific web pack config for running locally

Now we'll add the actual file that will be our entry point for webpack, for running locally.  We'll call it local.webpack.config.babel.js

> Note the .babel.js extension here, this get's picked up by @babel/register mentioned earlier on when installing babel.  This enable ES6 import/export etc to work in our webpack config build files and processes the webpack config with babel.

**Go ahead and create a file in build/webpack called local.webpack.config.babel.js with the following contents:**

``` Javascript

import { getBaseWebPackConfig } from './baseWebPackConfig'; //import the base webpack config

//this would be a good place where you can override any thing you want in the base webpack config which would 
//require some rework on the baseWebPackConfig.  For example you could break out all the webpack module rules, plugins etc and then import them
//here and build a custom webpack config just for local.  Or maybe you just want to have a wrapper function you call and pass it some environment
//flags you can process.

//Note* we get environment info in the webpack config for free, which will be illustrated soon when we set of the package.json scripts.

module.exports = getBaseWebPackConfig

```

## Setting up our SCSS

1. Create a src folder in the root of the app if not created already.
2. Under src, create an assets folder.
3. Under assets, create a folder called scss.
4. Under scss create two folders, one for themes and one for variables
5. under themes create a file called _metroTheme.scss and add the following contents: 

``` SCSS
/* this isn't a complete theme just an example */
$spacer: 1rem;
$enable-rounded: false;
$enable-shadows: false;
$enable-gradients: false;
$enable-transitions: false;
$enable-prefers-reduced-motion-media-query: true;
$enable-responsive-font-sizes: true;
```

6. under variables create a file called _vendorVariables.scss and add the following contents:

``` SCSS
@import '../themes/metroTheme';
```

7. Under scss create a file called vendor.scss and add the following contents: 

``` SCSS
$fa-font-path: '~font-awesome/fonts';
@import './variables/vendorVariables';
@import '~bootstrap/scss/bootstrap';
@import '~font-awesome/scss/font-awesome';
```

8. Under scss create a file called app.scss and add the following contents:

``` SCSS
/* reimport variables so we have them in app scss */
@import './themes/metroTheme';
@import '~/bootstrap/scss/_variables';
```

## Add basic structure for React App src files

1. Under src create a folder called components
2. Under components create a folder called routes
3. Under routes create a folder called home
4. Under home create a file called index.tsx and HomePage.tsx

**Add the following contents to HomePage.tsx:**

``` TSX
import React from 'react';

export const HomePage = () => {
    return (
        <h1>Hello World!</h1>
    )
}
```

**Add the following contents to home/index.tsx**

``` Tsx
export * from './HomePage';
```

5. Under routes add a file called index.tsx and add the following contents for it: 

``` TSX
export * as Home from './home';
```

6. Under Components create a file called App.Tsx and add the following contents:

``` TSX
import React from 'react';
import { BrowserRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import * as AppRoutes from './routes';

export const App = () => {
    return (
        <BrowserRouter>
            <Routes>                              
                <Route path="/home" element={<p>Shite two </p>}>
                    <Route path="/" element={(<p>shite!</p>)} />                    
                </Route>                
                <Route path="*" element={<Navigate to="/home" /> } />
            </Routes>
        </BrowserRouter>
    )
}
```

## Let's create our package.json scripts now to get ready to build:

**Add the following scripts section to your package.json:**

``` JSON
  "scripts": {
    "build": "webpack --config ./build/webpack/local.webpack.config.babel.js --env=localdev",
    "start": "webpack serve --open --config ./build/webpack/local.webpack.config.babel.js --env=localdev"
  }
```

> Note: the --env flag is how you pass environment flags to the webpack config, here we're passing an environment flag called localdev (which is made up right here)

## Install non dev depedencies before running build

> We're about done setting up an initial hello world app from scratch but first we need to install all our run time depedencies like React, React-Router, @types, Luxon, Bootstrap, etc (or anything else you want in your application)

**Run the following yarn commands in terminal:**

``` Node
//install the main depdencies 

//note - using beta versions of react-router and react-bootstrap
yarn add @popperjs/core bootstrap@5 font-awesome history react react-bootstrap@2.0.0-beta.5 react-dom react-router-dom@6.0.0-beta.2 react-router@6.0.0-beta.2

//Install typescript types for depedencies
yarn add @types/react @types/react-bootstrap @types/react-dom @types/react-router @types/react-router-dom
```

TODO | Test, Final Output, Add hot module reload.  Blog 2 - How to optimize bundle output
