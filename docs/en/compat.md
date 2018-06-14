# Compatibility

## language patches

1. [Array.isArray](https://github.com/juliangruber/isarray/)
2. [Object.assign](https://github.com/ryanhefner/Object.assign)
3. [JSON.stringify](https://github.com/flowersinthesand/stringifyJSON)
4. [console-polyfill](https://github.com/paulmillr/console-polyfill) 
5. [Object.keys](https://github.com/ljharb/object-keys)
6. [Object.is](https://github.com/ljharb/object-is)
7. [Array.prototype.forEach](polyfill/Array.prototype.forEach)
8. [Function.prototype.bind](https://github.com/leahciMic/polyfill-function-prototype-bind)

Or directly use the dynamic patching scheme provided by https://polyfill.io/

```jsx
<script src="https://cdn.polyfill.io/v2/polyfill.min.js"></script>
```

## Replace Core Library

The core library should be changed from **dist/React.js** to **dist/ReactIE.js**

It just added some special events compatible patch and innerHTML repair process on React.js.

The IE event patch is for the repair of some non-bubble events (input, change, submit, focus, blur), and the handling of some specific event attributes (pageX, pageY of the mouse event, which of the keyboard events, wheelDetla of the scroll event)

http://www.cnblogs.com/rubylouvre/p/5080464.html

## Animation

If the user uses an animation library such as react-transition-group, please note the patch that introduces **requestAnimationFrame**

## Uglify

If you use compression, you need to deal with uglify-js, because IE6-8, for **map.delete("ddd")**, **modulex.default** will write syntax error
Because keywords cannot be attribute names and method names. We can handle it with `es3ify-webpack-plugin` or ʻes3ify-loader`.

```javascript
//npm install uglifyjs-webpack-plugin@1.0.0-beta.2  
//UglifyJs3
new UglifyJsPlugin({
    parallel: {
        cache: true,
        workers: 4,
    },
    uglifyOptions: {
        mangle: {
            eval: true,
            toplevel: true,
        },
        parse: {
            html5_comments: false,
        },
        output: {
            comments: false,
            ascii_only: true,
            beautify: false,
        },
        ecma: 5,
        ie8: false,
        compresqs: {
            properties: true,
            unsafe: true,
            unsafe_comps: true,
            unsafe_math: true,
            unsafe_proto: true,
            unsafe_regexp: true,
            unsafe_Func: true,
            dead_code: true,
            unused: true,
            conditionals: true,
            keep_fargs: false,
            drop_console: true,
            drop_debugger: true,
            reduce_vars: true,
            if_return: true,
            comparisons: true,
            evaluate: true,
            booleans: true,
            typeofs: false,
            loops: true,
            toplevel: true,
            top_retain: true,
            hoist_funs: true,
            hoist_vars: true,
            inline: true,
            join_vars: true,
            cascade: true,
            collapse_vars: true,
            reduce_vars: true,
            negate_iife: true,
            pure_getters: true,
            pure_funcs: true,
            // arrows: true,
            passes: 3,
            ecma: 5,
        },
    },
    sourceMap: false,
}),
```

## React.createClass

React15 uses createClass to create the class. If you need this API, you can include `anujs/lib/createClass.js` in webpack.