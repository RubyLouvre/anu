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

### 特点：

1. 支持React16的各种**新功能**，Fragment, componentDidCatch, creactContext, createRef, forwardRef...
2. 体积非常迷你(2000行相对于react+react-dom的3万行, gz为其1/3大小)
3. 跑通**官方500多个单元测试**（其他迷你库都无法跑官方测试）
4. 支持**React全家桶**（react-redux, react-router-dom, react-router-redux）
5. 支持**后端渲染**（ renderToString, renderToStaticMarkup， renderToNodeStream ，renderToStaticNodeStream）
6. 支持[官方的chrome DevTools](https://github.com/RubyLouvre/anu/wiki/react-chrome%E5%BC%80%E5%8F%91%E8%80%85%E5%B7%A5%E5%85%B7)

### 官方脚手架 

https://github.com/RubyLouvre/create-anu-app

### IE8脚手架 

https://gitee.com/menhal/React_IE8_boilerplate


![image](https://cloud.githubusercontent.com/assets/190846/26769869/e5e1f6c0-49e4-11e7-94c9-f106179cf40f.png)

### dist目录下的变种说明
1. React 支持IE9+, 拥有PropTypes, createClass, createFactory
2. ReactIE 支持IE6+, 拥有PropTypes, createClass, createFactory (需要与lib目录下的polyfill配套使用)
3. ReactShim 支持IE9＋，不再拥有废弃API，删除了PropTypes, createClass, createFactory， unstable_renderSubtreeIntoContainer(如果大家只用在移动项目，并且使用es6方式定义组件，**建议**使用这个文件！)

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


### 测试需要用到的二进制依赖包

依赖于

+ [selenium-server-standalone](http://selenium-release.storage.googleapis.com/3.3/selenium-server-standalone-3.3.1.jar)
+ [chromedriver](https://sites.google.com/a/chromium.org/chromedriver/), [more available drivers](http://www.seleniumhq.org/projects/webdriver/)
+ nodejs v6.10.0+
+ karma


```bash
npm install selenium-standalone 
node_modules/.bin/selenium-standalone install
selenium-standalone start
# 另开窗口
npm run build
```
linux32可以改成mac, window

```bash
wget https://chromedriver.storage.googleapis.com/2.29/chromedriver_linux32.zip
unzip chromedriver_linux32.zip
wget http://selenium-release.storage.googleapis.com/3.3/selenium-server-standalone-3.3.1.jar
java -jar selenium-server-standalone-3.3.1.jar
# 另开窗口
npm run build
```

