##安装

```javascript
npm i anujs
```

如何在已经使用了React的项目中使用，修改webpack.config.js

```javascript
const es3ifyPlugin = require('es3ify-webpack-plugin');

resolve: {
   alias: {
      'react': 'anujs',
      'react-dom': 'anujs',
        // 若要兼容 IE 请使用以下配置
        // 'react': 'anujs/dist/ReactIE',
        // 'react-dom': 'anujs/dist/ReactIE',
        // 如果引用了 prop-types 或 create-react-class
        // 需要添加如下别名
        'prop-types': 'anujs/lib/ReactPropTypes',
        'create-react-class': 'anujs/lib/createClass'
        //如果你在移动端用到了onTouchTap事件
        'react-tap-event-plugin': 'anujs/lib/injectTapEventPlugin',  
   }
},
plugins: [ new es3ifyPlugin()]
```

压缩的配置
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