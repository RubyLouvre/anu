[![NPM version][npm-image]][npm-url]
[![Build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]
[![Codacy badge][codacy-image]][codacy-url]
[![Downloads][downloads-image]][npm-url]

# ;-less.js // Make your JavaScript Code Semicolon-less


## Rationale

### You don't need semicolons in most cases

### Write semicolons in *ONLY* 5 cases

 - `;-less	// line starts with unary - operator`
 - `;+less	// line starts with unary + opeartor`
 - `;/less/	// line starts with regexp literal`
 - `;[less]	// line starts with array initializer`
 - `;(less)	// line starts with grouping operator, such as IIFE`

NOTE: In real-world, only the last case is common.


## Usage

### Install
```sh
npm install -g semicolon-less
```

### CLI

Convert `test.js` to semicolon-less style
```sh
semicolon-less test.js
```

Convert all js files to semicolon-less and output to `dest` directory
```sh
semicolon-less --out=dest *.js
```

Support pipe
```sh
echo 'let x = 1' | babel | semicolon-less
```

Read source code form stdin
```sh
semicolon-less -
```

All `semicolon-less` can be replaced by the shortcut `-less`, for example, to show the help:
```sh
-less --help
```


### API
```js
var less = require('semicolon-less')

// source can be a string or buffer or stream which contains the source code
var source = require('fs').readFileSync('source.js')

// less() return transformed source
var semicolonlessSource = less(source)
```


### Gulp friendly
```js
var gulp = require('gulp')
var less = require('semicolon-less/gulpplugin')

gulp.src('*.js').pipe(less())
```


## Bugs and limitations

Currently I'm using [yyx990803/semi](https://github.com/yyx990803/semi) as underground implementation, and it doesn't support some ES6 syntax (eg. for-of, generators. See the skipped [tests](https://github.com/hax/semicolon-less.js/blob/master/test/test.js)). We will solve it in the future.


## I want to convert semicolon-less style back to semicolon-itis style

It's totally unnecessary and not the scope of this project. But if you really
want it due to some reasons (ie. your boss/team/IDEs/tools insist on semicolon-itis style), use [yyx990803/semi](https://github.com/yyx990803/semi).

In fact, most js code generators will add semicolons as <abbr title="Automatic Semicolon Insertion">ASI</abbr> rules. So you could just
use [uglifyjs](https://github.com/mishoo/UglifyJS) to regenerate your codes.


## I don't agree with you; semicolons are REQUIRED!

Ok;
You must use Issac's awesome [semicolons](https://www.npmjs.org/package/semicolons) package;
> Ensure that all JavaScript programs have the maximum amount of safety;
> when you require("semicolons"), THEY ARE REQUIRED;


[npm-image]: https://img.shields.io/npm/v/semicolon-less.svg?style=flat-square
[npm-url]: https://npmjs.org/package/semicolon-less
[travis-image]: https://img.shields.io/travis/hax/semicolon-less.js/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/hax/semicolon-less.js
[coveralls-image]: https://img.shields.io/coveralls/hax/semicolon-less.js/master.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/hax/semicolon-less.js?branch=master
[downloads-image]: http://img.shields.io/npm/dm/semicolon-less.svg?style=flat-square
[codacy-image]: https://img.shields.io/codacy/12ebe2ff5dd0429ca51c78b69955a4ad.svg?style=flat-square
[codacy-url]: https://www.codacy.com/public/hax/semicolon-less.js
