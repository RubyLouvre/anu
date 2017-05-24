# rollup-plugin-istanbul

[![Build Status](https://travis-ci.org/artberri/rollup-plugin-istanbul.svg?branch=master)](https://travis-ci.org/artberri/rollup-plugin-istanbul)
[![Last version](https://img.shields.io/npm/v/rollup-plugin-istanbul.svg)](https://www.npmjs.com/package/rollup-plugin-istanbul)
[![Total Downloads](https://img.shields.io/npm/dt/rollup-plugin-istanbul.svg)](https://www.npmjs.com/package/rollup-plugin-istanbul)
[![Downloads Last Month](https://img.shields.io/npm/dm/rollup-plugin-istanbul.svg)](https://www.npmjs.com/package/rollup-plugin-istanbul)
[![Dependencies Status](https://david-dm.org/artberri/rollup-plugin-istanbul.svg)](https://david-dm.org/artberri/rollup-plugin-istanbul)

Seamless integration between [Rollup](https://github.com/rollup/rollup) and [Istanbul](https://github.com/gotwarlost/istanbul).


## Why?

If you're using Rollup to generate a standalone bundle you will probably need also to bundle your tests before running them, and if you want the code coverage report, you will need to instrument the program files before the bundle is generated to avoid instrumenting also the code of the test files.

That is the reason why rollup-plugin-istanbul exists.


## Installation

```bash
npm install --save-dev rollup-plugin-istanbul
```


## Usage

```js
import { rollup } from 'rollup';
import istanbul from 'rollup-plugin-istanbul';

rollup({
  entry: 'main.js',
  plugins: [
    istanbul({
      exclude: ['test/**/*.js']
    })
  ]
}).then(...)
```

### Options

All options are optional.

#### `include`

Can be a minimatch pattern or an array of minimatch patterns. If is omitted or of zero length, files should be included by default; otherwise they should only be included if the ID matches one of the patterns.

#### `exclude`

Can be a minimatch pattern or an array of minimatch patterns. Files to exclude, commonly the test files.

#### `instrumenterConfig`

An object of options that will be passed to the instrumenter.

Default value:

```js
{
  esModules: true,
  codeGenerationOptions: {
    sourceMap: id,
    sourceMapWithCode: true
  }
}
```

[More info](http://gotwarlost.github.io/istanbul/public/apidocs/classes/Instrumenter.html#method_Instrumenter) about options.

#### `instrumenter`

Can be a replacement for the istanbul library, for example [isparta](https://github.com/douglasduteil/isparta). It should implement the same API as istanbul.

### Other usage options

`rollup-plugin-istanbul` can be used with karma or other test runners that allow preprocessors. Here you can see how to implement it with Karma with the help of the [karma-rollup-plugin](https://github.com/TrySound/karma-rollup-plugin) and [karma-coverage](https://github.com/karma-runner/karma-coverage):

```js
// karma.conf.js
module.exports = function (config) {
  config.set({
    files: [
      'test/*.js'
    ],
    preprocessors: {
      'test/*.js': ['rollup']
    },
    rollupPreprocessor: {
      rollup: {
        plugins: [
          require('rollup-plugin-istanbul')({
            exclude: ['test/*.js']
          })
        ]
      }
    },
    reporters: ['coverage']
  });
};
```

Going further, this is how you can implement it when you are using babel because you are writing ES2015 code:

```js
// karma.conf.js

var babelrc = require('babelrc-rollup').default,
    babel = require('rollup-plugin-babel'),
    istanbul = require('rollup-plugin-istanbul');

module.exports = function (config) {
  config.set({
    files: [
      'test/*.js'
    ],
    preprocessors: {
      'test/*.js': ['rollup']
    },
    rollupPreprocessor: {
        plugins: [
            istanbul({
                exclude: ['test/*.js']
            }),
            babel(babelrc())
        ],
        format: 'iife',
        sourceMap: 'inline'
    },
    reporters: ['coverage']
  });
};
```

Example of implementation with Mocha provided by @piuccio:
[https://github.com/artberri/rollup-plugin-istanbul/issues/11](https://github.com/artberri/rollup-plugin-istanbul/issues/11)

## License

[MIT](LICENSE.md)
