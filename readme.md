# anu

<p align="center">
<a href="https://badge.fury.io/js/anujs">
<img src="https://badge.fury.io/js/anujs.svg" alt="npm version" height="18">
</a>
<a href="https://travis-ci.org/RubyLouvre/anu">
<img src="https://travis-ci.org/RubyLouvre/anu.svg?branch=master" alt="Travis CI Status"/>
</a>
</p>

```bash
npm install anujs
```
读作 安努 ，苏美尔的主神，开天辟地。一个高级兼容官方React16的迷你React框架，用于上线时无痛替换React，压缩整个项目的体积。
QQ交流学习群：  370262116

[体积变化](https://wx1.sinaimg.cn/mw690/7109e87fly1frfqw50lduj21kw0rzk0h.jpg)

数据来源： https://bundlephobia.com/

### 特点：

1. 支持React16的各种**新功能**，Fragment, componentDidCatch, creactContext, createRef, forwardRef...
2. 体积非常迷你(3000行相对于react+react-dom的3万行, gz为其1/3大小)
3. 跑通**官方700多个单元测试**（其他迷你库都无法跑官方测试）
4. 支持**React全家桶**（react-redux, react-router-dom, react-router-redux）
5. 支持99％的antd组件

### 官方脚手架 

https://github.com/RubyLouvre/create-anu-app

### IE8脚手架 

https://gitee.com/menhal/React_IE8_boilerplate


![image](https://cloud.githubusercontent.com/assets/190846/26769869/e5e1f6c0-49e4-11e7-94c9-f106179cf40f.png)



### 开源协议 
Apache Licene 2.0

### 轻松切换已有的React项目

```js
//webpack配置
resolve: {
   alias: {
      'react': 'anujs',
      'react-dom': 'anujs',
        // 若要兼容 IE 请使用以下配置
        // 'react': 'anujs/dist/ReactIE',
        // 'react-dom': 'anujs/dist/ReactIE',
        // 'redux': 'anujs/lib/ReduxIE',//这主要用于IE6－8，因为官方源码中的isPlainObject方法性能超差
        // 如果引用了 prop-types 或 create-react-class
        // 需要添加如下别名
        'prop-types': 'anujs/lib/ReactPropTypes',
        'create-react-class': 'anujs/lib/createClass'
        //如果你在移动端用到了onTouchTap事件
        'react-tap-event-plugin': 'anujs/lib/injectTapEventPlugin',  
   }
},
```

详细用法与示例见  [wiki](https://github.com/RubyLouvre/anu/wiki) 





