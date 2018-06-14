# anu


[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/Rubylouvre/anu/blob/master/LICENSE) 
[![npm version](https://img.shields.io/npm/v/anujs.svg?style=flat)](https://www.npmjs.com/package/anujs)
[![CircleCI](https://circleci.com/gh/RubyLouvre/anu/tree/master.svg?style=svg)](https://circleci.com/gh/RubyLouvre/anu/tree/master)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/RubyLouvre/anu/pulls)


```bash
npm install anujs
```

anujs是一个高级兼容React16的迷你React 框架，它兼容React16.3.0的99%接口， 跑通了官方788个case， 支持React生态圈的99％的组件与UI库。

中国用户可以加QQ交流学习群：  370262116


众所周知， React 一直存在体积过大的诟， 因此我在熟读其源码的基础上，重新实现了React， gz后只有React+ReactDOM的三分之一。详细数据见 https://bundlephobia.com/, anu@1.4.3只有 13.1 kb， react@16.4.1为 2.3 kb, react-dom@16.4.1为 30.5 kb。如果使用路由器，react-router-dom@4.3.1为11 kb， reach@1.0.1为 4.3kb。

## 体积比对

现在React全家桶有如下常用套餐

套餐1：react + react-dom + react-router-dom + redux + react-redux + redux-saga,
体积为 2.3 + 30.5 + 11 + 5 + 4.3 + 8.4 = **61.4** kb
合适于刚入门的人群

套餐2：react + react-dom + react-router-dom + mobx + mobx-react 
体积为 2.3 + 30.5 + 11 + 13.8 + 6.4 = **64** kb
合适于对redux怨言的人群

套餐3：anujs + reach + redux + react-redux + rematch
体积为 13.1 + 6 + 2.5 + 5 + 4.3 = **31** kb
合适于体积、兼容性、易用性有要求的人群

上述代码的测量工具为gzip-size-cli， jsize 及 https://bundlephobia.com/



## 与其他迷你react的比较 

主要竞品有 inferno, preact, rax, react-lite, nervjs, 前两个是海外的， 后三个是中国的，中国由于网络的状况，对体积要来比较高。

inferno, 需要加上inferno-compat， 才能与官方的API保持一致， 但组件套组件的情况下， 生命周期钩子的执行顺序与官方不一致， 因此不兼容React的绝大多数的UI库。不支持旧式IE。

preact, 需要加上preact-compat， 才能与官方的API保持一致， 但组件套组件的情况下， 生命周期钩子的执行顺序与官方不一致， 因此不兼容React的绝大多数的UI库。 并且preact-compat内部使用了Object.definePropety，因此无法运用于IE8， 也造成它的性能严重劣化。

rax， 中国的阿里巴巴集团推出，支持React16大多数API，不支持IE8， 能跑一些React UI库。

react-lite, 中国的携程集团推出，只兼容React15, 支持IE8，能跑一些React UI库。

nervjs, 中国的京东集团推出，支持React16大多数API，代码与inferno, rax很相近， 没有case证明其兼容IE8，性能指标也很可疑。

## anujs优势

1. 支持React16的各种新功能，Fragment, componentDidCatch, creactContext, createRef, forwardRef...
2. 跑通官方近800多个单元测试（其他迷你库都无法跑官方测试）
3. 支持React全家桶（react-redux, react-router-dom, react-router-redux， react-lazy-load， react-hot-loader...）
4. 支持99％的antd组件 （antd为中国最有名的React UI 库）

## 测试

```shell
npm test
```