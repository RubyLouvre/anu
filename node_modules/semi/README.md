# Semi [![npm version](https://badge.fury.io/js/semi.svg)](http://badge.fury.io/js/semi) [![Build Status](https://travis-ci.org/yyx990803/semi.svg?branch=master)](https://travis-ci.org/yyx990803/semi)

> To semicolon or not to semicolon; that is the question

Add/remove semicolons from your JavaScript. Supports full ES6!

## Why???

Because style.

On a more serious note, some people (including me) feel more comfortable and productive when writing JavaScript without semicolons. (If you disagree, [read this](#but-semicolons-are-required)) However, this is often not viable in a team environment, or when working on a project with established code style requirements.

As a solution to this problem, Semi can add semicolons to files written in a semicolon-less style, and can also remove semicolons from those written with semicolons. This allows you to write code in the style you like and just auto convert it before committing your code.

It was originally implemented by [hacking jshint](https://github.com/yyx990803/jshint/commit/e7bb51d7f5e72db2ce98cd76d8657937dac498e5) and now by using a custom rule for [ESLint](http://eslint.org/). Semi 100% preserves your original code formatting (other than semicolons). It even takes care of special cases where a newline semicolon is needed (see below).

## Usage

### CLI

``` bash
npm install -g semi

Usage: semi [add|rm] [files...] [--out dir] [--leading] [--silent]

Options:

  --out      Output directory. If not specified, will overwrite original.
  --leading  Always add leading semicolons for lines that start with +-[(/.
  --silent   Suppress output messages.
```

### API

``` js
var semi = require('semi')

// handle errors
semi.on('error', function (err) { /* ... */ })

// semi.add(<String>)
var jsWithSemicolons = semi.add(jsWithoutSemicolons)
// semi.remove(<String>)
var jsWithoutSemicolons = semi.remove(jsWithSemicolons, {
  leading: true
})
```

There's also [Semi for SublimeText3](https://github.com/yyx990803/semi-sublime)!

## It doesn't work!

If it doesn't seem to do anything, it's most likely because your code contains syntax errors.

## Special Cases

Semi will automatically convert between the following two cases (also for newlines that start with `[`, `+`, `-` or a regex literal):

``` js
// A
var a = b;
(function () {
  /* ... */
})()
// B
var a = b
;(function () {
  /* ... */
})()
```

When `leading` option is true, it will add a leading semicolon for all newlines that start with one of those special tokens, even if the code is valid without the semicolon:

``` js
var a = 123;
++a;
// converts to:
var a = 123
;++a
```

However, it will not do anything to the following, because it is valid JavaScript and Semi cannot safely assume you wanted a semicolon there.

``` js
var a = b
(function () {
  /* ... */
})()
```

## But Semicolons Are REQUIRED!!!

Semicolons in JavaScript are indeed **optional**. Now before you start to talk about how semicolons improve readibility simply because you also write other C-style languages, try to realize that JavaScript is not C, nor is it Java. Its semicolons are designed to be optional and dropping them can be a productivity boon for some people, including me. In fact, languages like Go and Groovy also have optional semicolons and the convention is not using them. You can even use semicolons in Ruby and Python, but obviously nobody does that because it's actually very easy to identify EOL as the end of a statement where it makes sense.

Now, if you are adding semicolons everywhere because you fear dropping them can cause mysterious bugs in some weird browsers, break minifiers, or the rules are simply too hard to remember, you are doing it wrong. The correct way to deal with FUD is to confront them and understand the root cause. You should read these following articles:

- [Semicolons in JavaScript are optional](http://mislav.uniqpath.com/2010/05/semicolons/)
- [An Open Letter to JavaScript Leaders Regarding Semicolons](http://blog.izs.me/post/2353458699/an-open-letter-to-javascript-leaders-regarding)
- [JavaScript semicolon insertions](http://inimino.org/~inimino/blog/javascript_semicolons)
