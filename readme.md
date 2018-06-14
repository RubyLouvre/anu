# anu


[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/Rubylouvre/anu/blob/master/LICENSE) 
[![npm version](https://img.shields.io/npm/v/anujs.svg?style=flat)](https://www.npmjs.com/package/anujs)
[![CircleCI](https://circleci.com/gh/RubyLouvre/anu/tree/master.svg?style=svg)](https://circleci.com/gh/RubyLouvre/anu/tree/master)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/RubyLouvre/anu/pulls)


```bash
npm install anujs
```
读作“安努”，苏美尔的主神，开天辟地。一个高级兼容官方 React16 的迷你 React 框架，用于上线时无痛替换 React，压缩整个项目的体积。
QQ 交流学习群：370262116

[体积变化](https://wx1.sinaimg.cn/mw690/7109e87fly1frfqw50lduj21kw0rzk0h.jpg)

数据来源： https://bundlephobia.com/

### 特点：

1. 支持 React16 的各种**新功能**，Fragment, componentDidCatch, creactContext, createRef, forwardRef...
2. 体积非常迷你 (3000 行相对于 react+react-dom 的 3 万行, gz 后为其 1/3 大小)
3. 跑通**官方 700 多个单元测试**（其他迷你库都无法跑官方测试）
4. 支持 **React 全家桶**（react-redux, react-router-dom, react-router-redu, react-lazy-load, react-hot-loader...）
5. 支持 99％ 的 antd 组件

### 官方脚手架 

https://github.com/RubyLouvre/create-anu-app

### IE8脚手架 

https://gitee.com/menhal/React_IE8_boilerplate


![image](https://cloud.githubusercontent.com/assets/190846/26769869/e5e1f6c0-49e4-11e7-94c9-f106179cf40f.png)



### 开源协议 
MIT

### 轻松切换已有的 React 项目

```js
// webpack配置
resolve: {
   alias: {
      'react': 'anujs',
      'react-dom': 'anujs',
        // 若要兼容 IE 请使用以下配置
        // 'react': 'anujs/dist/ReactIE',
        // 'react-dom': 'anujs/dist/ReactIE',
        // 'redux': 'anujs/lib/ReduxIE',// 这主要用于IE6－8，因为官方源码中的 isPlainObject 方法性能超差
        // 如果引用了 prop-types 或 create-react-class
        // 需要添加如下别名
        'prop-types': 'anujs/lib/ReactPropTypes',
        'create-react-class': 'anujs/lib/createClass'
        // 如果你在移动端用到了 onTouchTap 事件
        'react-tap-event-plugin': 'anujs/lib/injectTapEventPlugin',  
   }
},
```

详细用法与示例见  [wiki](https://github.com/RubyLouvre/anu/wiki) 

### 测试

```
npm test
```

