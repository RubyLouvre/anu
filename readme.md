
![anujs](https://github.com/RubyLouvre/anu/blob/master/lib/logo.png?raw=true)

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/Rubylouvre/anu/blob/master/LICENSE) 
[![npm version](https://img.shields.io/npm/v/anujs.svg?style=flat)](https://www.npmjs.com/package/anujs)
[![CircleCI](https://circleci.com/gh/RubyLouvre/anu/tree/master.svg?style=svg)](https://circleci.com/gh/RubyLouvre/anu/tree/master)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/RubyLouvre/anu/pulls)
[![Qunar.com](https://user-images.githubusercontent.com/190846/48761333-5b66df80-ece3-11e8-80e4-5df19b912dd5.png)](https://github.com/qunarcorp)



```bash
npm install anujs
```

A mini React-like framework that is extremely compatible with  React16。
QQ group：  370262116

![size](https://wx1.sinaimg.cn/mw690/7109e87fly1frfqw50lduj21kw0rzk0h.jpg)

source： https://bundlephobia.com/

### advantage：

1. Support various new features of **React16**, Fragment, componentDidCatch, creactContext, createRef, forwardRef...
2. The size is very small (only 3000 lines, gzip only 13kb, one third of React+ReactDOM)
3. Pass more than 700 official unit tests  (other mini libraries can not run the official test)
4. Share the huge ecology of React（React-router-dom, react-router-redux, react-lazy-load, react-hot-loader...）
5. Supports 99% antd components (`antd`is an enterprise-class UI components in China).
6. Excellent browser compatibility, easy to handle all kinds of business under IE6-8.
7. It comes with a painless state manager **Rematch** and a handy router **Reach**.
8. Support miniapp(微信小程序, 支付宝，快应用) https://rubylouvre.github.io/nanachi/



### boilerplate 


* https://github.com/RubyLouvre/anu-ie8-example (IE8)
* https://github.com/magicapple/anujs-webpack4-ie7-8
* https://gitee.com/menhal/React_IE8_boilerplate
* https://github.com/meeteason/react-webpack-ie6-boilerplate

### License

MIT

### webpack config

```js
resolve: {
    alias: {
       'react': 'anujs',
       'react-dom': 'anujs',
         // For compatibility with IE please use the following configuration
         // 'react': 'anujs/dist/ReactIE',
         // 'react-dom': 'anujs/dist/ReactIE',
         // 'redux': 'anujs/lib/ReduxIE', /// This is mainly for IE6-8, because of the poor performance of the isPlainObject method in the official source code.
         // If you reference prop-types or create-react-class
         // Need to add the following alias
         'prop-types': 'anujs/lib/ReactPropTypes',
         'create-react-class': 'anujs/lib/createClass',
         // If you use the onTouchTap event on the mobile side
         'react-tap-event-plugin': 'anujs/lib/injectTapEventPlugin',
    }
},
```


### Testing

```
npm test
```

