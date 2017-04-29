var rollup = require('rollup'),
    fs = require('fs'),
    istanbul = require('rollup-plugin-istanbul'),
    babel = require("babel-core"),
    less = require('semicolon-less'),
    cache
var importAlias = require('rollup-plugin-import-alias');

module.exports = rollup.rollup({
    entry: 'test/spec.js',
    cache: cache,
    plugins: [
        importAlias({
            Paths: {
                src: './src'
            },
            Extensions: ['js']

        }),
        istanbul({
            exclude: ['test/**/*.js']
        })
    ]
}).then(function(bundle) {
    // Generate bundle + sourcemap
    var result = bundle.generate({
        format: 'umd',
        moduleName: 'React'
    });
    // Cache our bundle for later use (optional)
    cache = bundle;
    var code = result.code.replace(
            /Object\.defineProperty\(exports,\s*'__esModule',\s*\{\s*value:\s*true\s*\}\);/,
            "exports.__esModule = true").
        //      replace(/'use strict';?/,'')
    replace(/React\$1/g, 'React')

    result = babel.transform(code, {
        presets: ["es2015"],
        compact: false
    })

    code = result.code.replace(/\}\)\(undefined,/, '})(this,')
    fs.writeFileSync('./dist/React.test.js', less(code));

}).catch(function(e) {
    console.log('error', e)
})