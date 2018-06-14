# 兼容性

### 语言补丁

1. [Array.isArray](https://github.com/juliangruber/isarray/)
2. [Object.assign](https://github.com/ryanhefner/Object.assign)
3. [JSON.stringify](https://github.com/flowersinthesand/stringifyJSON)
4. [console-polyfill](https://github.com/paulmillr/console-polyfill) 
5. [Object.keys](https://github.com/ljharb/object-keys)
6. [Object.is](https://github.com/ljharb/object-is)
7. [Array.prototype.forEach](polyfill/Array.prototype.forEach)
8. [Function.prototype.bind](https://github.com/leahciMic/polyfill-function-prototype-bind)

或者直接使用https://polyfill.io/ 提供的动态补丁方案


```jsx
<script src="https://cdn.polyfill.io/v2/polyfill.min.js"></script>
```

## 更换核心库

核心库应该由**dist/React.js**改成**dist/ReactIE.js**

它只是在React.js上添加了一些特殊事件的兼容补丁与innerHTML的修复处理。


IE事件补丁是针对一些不冒泡事件的修复（input, change, submit, focus, blur），及一些特定事件属性的处理(鼠标事件的pageX, pageY, 键盘事件的which, 滚轮事件的wheelDetla)

http://www.cnblogs.com/rubylouvre/p/5080464.html

## 动画


如果用户用到react-transition-group这样的动画库，请注意引入**requestAnimationFrame**的补丁

https://github.com/darius/requestAnimationFrame

###压缩

如果你用到压缩，就需要处理 uglify-js产生问题，因为IE6-8 ,对于**map.delete("ddd")**, **modulex.default**这样的写法会报语法错误
因为关键字不能做属性名与方法名。我们可以用`es3ify-webpack-plugin`或`es3ify-loader`进行处理。

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

React15使用createClass来创建类，如果需要这个API，可以在babel中引入 `anujs/lib/createClass.js`


*  https://github.com/magicapple/anujs-webpack4-ie7-8

