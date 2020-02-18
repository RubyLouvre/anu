# 关于

此项目由 [Qunar.com](https://github.com/qunarcorp) 提供支持。


大约从11月份开始，我们切换到branch3开发，正式启动自定义组件机制实现nanachi的组件机制

原来master上使用 template标签来编写组件，它其实规避了许多问题，因为4大小程序的自定义组件机制都各有不同，template则是兼容成本最低的方案。但是用template标签编写组件，其实那不是组件，对于小程序来说就是视图片段。换言之，一个页面只有一个组件，而这个组件的数据则是非常庞大。果不其然，它在支付宝小程序的IOS8/9中因为性能问题挂掉，只好匆匆启动后备方案

简单回顾一下四大小程序的模板

```html
<!--wxml-->
<view class="container">
  <view class="userinfo" bindtap="eventCanBubble">
    <block wx:if="{{!hasUserInfo && canIUse}}">
      <button catchtap="eventNoBubble"> 获取头像昵称 </button>
    </block>
    <block wx:else>
      <view wx:for="array" wx:for-item="el" wx:for-index="index"  wx:key="*this">
         {{el.title}}
      </view>
    </block>
  </view>
</view>

<!--axml-->
<view class="container">
  <view class="userinfo" onTap="eventCanBubble">
   <block a:if="{{!hasUserInfo && canIUse}}">
     <button catchTap="eventCanBubble"> 获取头像昵称 </button>
    </block>
    <block a:else>
      <view a:for="array" a:for-item="el" a:for-index="index"  key="title" >
         {{el.title}}
      </view>
    </block>
  </view>
</view>

<!--swan-->
<view class="container">
  <view class="userinfo" bind:tap="eventCanBubble">
    <block s-if="{{!hasUserInfo && canIUse}}">
      <button catch:tap="eventCanBubble"> 获取头像昵称 </button>
    </block>
    <block s-else>
      <view s-for="(index, el) in array" s-key="title" >
         {{el.title}}
      </view>
    </block>
  </view>
</view>

<!--快应用ux-->
<template>
  <div class="container">
    <div class="userinfo" onClick="eventCanBubble">
     <block if="{{!hasUserInfo && canIUse}}">
       <button onClick="eventCanBubble">
         <text> 获取头像昵称</text>
       </button>
      </block>
      <block else>
        <div for="(index, el) in array" tid="title" >
          <text>{{el.title}}</text>
        </div>
      </block>
    </div>
  </div>
</template>

<!--头条小程序-->
<view class="container">
  <view class="userinfo" bindtap="eventCanBubble">
    <block tt:if="{{!hasUserInfo && canIUse}}">
      <button catchtap="eventCanBubble"> 获取头像昵称 </button>
    <block tt:else>
      <view tt:for="array" tt:for-item="el" tt:for-index="index"  tt:key="*this">
         {{el.title}}
      </view>
    </block>
  </view>
</view>

```



从模板来看，其实差别不大，改一下属性名，每个公司都想通过它们来标识自己的存在。但内部实现完全不一样，因为源码并没有公开或者混淆了。使用自定义组件机制的风险就比`<template>`标签大很多。 BAT三公司都暴露了一个Component入口函数，让你传入一个配置对象实现组件机制，而以小米为首的快应用则是内部走vue，没有Component这个方法，只需你export一个配置对象。
```javascript
//微信
Component({
  data: {},
  lifetimes: {//钩子必须放在lifetimes
    created(){},//拿不到实例的UUID
    attached(){},//钩子触发顺序与元素在文档位置一致
    dettached(){}
  },
  methods: {//事件句柄必须放在methods
    onClick(){}
  }
})
//支付宝
Component({
  data: {},
  //没有与created对应的didCreate/willMount钩子
  didMount(){},//能拿到实例的UUID
  didUpdate(){},//钩子触发顺序是随机的
  didUnmount(){},
  methods: {
    onClick(){}
  }
})
//支付宝 生命周期V2
Component({
  data: {},
  onInit(){},//对应 react constructor， 只可以读取 this.props 设置 this.data 或调用 this.setData/$spliceData 修改 已有data
  deriveDataFromProps(props){},//对应 react getDerivedStateFromProps，只可以调用 this.setData/$spliceData 修改 data
  didMount(){},//对应 react componentDidMount
  didUpdate(){},//对应 react componentDidUpdate
  didUnmount(){},//对应 react componentWillUnmount
  methods: {
    onClick(){}
  }
})

//百度
Component({
  data: {},
  created(){},//应该是微信自定义组件的早期格式，没有lifetimes，methods
  attached(){},//拿不到实例的UUID
  dettached(){},//钩子触发顺序与元素在文档位置一致
  onClick(){}
})
//小米（快应用都是由小米提供技术方案）
export {
   props: {},//基本与百度差不多
   onInit(){},
   onReady(){},
   onDestroy(){},
   onClick(){}
}
//头条小程序
Component({
  data: {},
  created(){},//拿不到实例的UUID
  attached(){},//钩子触发顺序与元素在文档位置一致
  dettached(){}
  methods: {//事件句柄必须放在methods
    onClick(){}
  }
})
```

从内部实现来看，BAT 都是走迷你React虚拟DOM， 快应用走迷你 vue虚拟DOM， 但支付宝的实现不好，钩子的触发顺序是随机的。因此在非随机的三种中，我们内部有一个迷你React, anu，产生的组件实例放进一个队列中，而BTM （百度，微信，小米）的created/onInit钩子再逐个再出来，执行setData实现视图的更新。而支付宝需要在编译层，为每个自定义组件标签添加一个UUID ，然后在didMount匹配取出。


```javascript
//anu 
onBeforeRender(fiber){
   var type = fiber.type;
   var reactInstances = type.reactInstances;
   var instance = fiber.stateNode;
   if(!instance.wx && reactInstances){
     reactInstances.push(instance)
   }
}

//BTM的created/onReady  <anu-dog></anu-dog>
created(){
   var reactInstances = type.reactInstances;
   var reactInstance = reactInstances.shift();
   reactInstance.wx = this;
   this.reactInstance = reactInstance;
   updateMiniApp(reactInstance)
}

//支付宝  <anu-dog instanceUid="{{'i32432' }}"></anu-dog>
didMount(){
  var reactInstances = type.reactInstances;
  var uid = this.props.instanceUid;
  for (var i = reactInstances.length - 1; i >= 0; i--) {
      var reactInstance = reactInstances[i];
      if (reactInstance.instanceUid === uid) {
          reactInstance.wx = this;
          this.reactInstance = reactInstance;
          updateMiniApp(reactInstance);
          reactInstances.splice(i, 1);
          break;
      }
  }
}

```
其实如果一个页面的数据量不大，template标签实现的组件机制比自定义组件的性能要好，自定义组件标签会对用户的属性根据props配置项进行过滤，
还要传入slot，启动构造函数等等。但数据量大，自定义组件机制由于能实现局部更新，性能就反超了。

但支付宝是个例，由于它延迟到在didMount钩子才更新数据，即视图出来了又要刷新视图，比其他小程序多了一次rerender与伴随而来的reflow。

快应用就更麻烦些，主要有以下问题

1. 快应用要求像vue那样三种格式都放在同一个文件中，但script标签是无法export出任何东西，于是我只好将组件定义单独拆到另一个文件， 才搞定引用父类的问题。

2. 快应用在标签的使用上更为严格，文本节点必须放在a, span, text, option这4种标签中，实际上span的使用限制还严厉些，于是我们在编译时，只用到a, text, option。而a是对标BAT的navigator，因此一般也用不到。

3. 最大的问题是对CSS支持太差，比如说不支持`display: block, display: line`, 不支持浮动，不支持相对绝对定位，不支持`.class1.class2`的写法……  

4. API也比BAT的API少这么多东西，兼容起来非常吃力。




## 娜娜奇提供的核心组件及他们对应的关系，核心的技术内幕

娜娜奇主要分为两大部分， 编译期的转译框架， 统一将以React为技术栈的工程转换为各种小程序认识的文件与结构

转译框架又细分为4部分， react组件转译器，es6转译器， 样式转译器及各种辅助用的helpers.

运行时的底层框架与补丁组件， 底层框架为ReactWx, ReactBu, ReactAli, ReactQuick,分别对标微信，百度，
支付宝小程序及快应用，因为官方React的size太大，并没有适用的钩子机制，让我们在渲染前将数据传给原生组件进行
setData() (setData是小程序实例更新视图的核心方法)，因此我们基于我们早已成熟的迷你React框架anu进行一下扩展 
去掉DOM渲染层，加上各种对应的渲染层，从而形成 对应的React.

补丁组件是指， 小程序都自带一套UI组件，它们存在一些无法抹平的差异或在个别平台直接没有这个组件，我们需要用原生的
view ,text等基础组件元素封装成缺省组件，比如Icon, Button, Navigator.


## 娜娜奇的目录结构以及对应的工程规范，cli以及发布打包，如何控制size

娜娜奇的目录结构以微信的标准为蓝图，大概分为app.js, pages目录， components目录，针对我们的业务，还添加了
commons目录与assets目录。

- app.js是全工程的配置，以react组件形式呈现， 全局共享对象，全局的分享函数都在这实例上
- pages目录 放所有页面组件， 组件在index.js中， 这里目录存在层次
- components目录 放所有有视图的业务组件， 组件在index.js中， 这里的目录只有两层， components/ComponentName/index.js
index.js 要exports与目录名同名的类名
- commons目录 放所有没有视图的业务组件，没有文件名与目录名的限制，
但希望每个业务线的组件都放在与业务线同名的目录下
- assets目录， 放静态资源

app.js pages目录，components目录会应用react转译器与样式转译器， commons目录应用es6转译器，
assets目录应用样式转译器


直观的效果见 [这里的两个图](publish.md)

cli 命令见 [这里](install.md)

build后的大小 [见开发工具的预览](diff.md) 

## 娜娜奇提供的重要功能组件和模块，如何帮助开发者做到快速开发

提供了 @react, @components，@assets这几个别名，用法如
import React from '@react' 这样在很深的目录下，大家就不需要
import React from '../../../../ReactAli'这样写
@components指向components目录
@assets 则用在css, sass, less文件中指向assets目录

React.getApp(), React.getCurrentPage()方便大家得到当前APP配置对象与页面组件的实例

React.api 将对所有平台的上百个API进行抹平，API是wx, swan, my这几个对象，它们里面提供了访问底层的能力
如通信录，电池，音量，地理信息, 上传下载，手机型号信息等一大堆东西

React.api 里的所有异步方法，都Promise化，方便大家直接用es7 的async ,await语法

样式转译器，帮用户处理样式表中的rpx/px之间的转换。

## 为了保证跨平台，设计娜娜奇技术方案的重要原则和开发规范，哪些不支持

所有接口访问必须 使用React.api的方法，不要直接在wx, swan, my对象中取

React组件的只有render方法才能使用JSX，它们需要遵守一下规范，详见[这里](jsx.md)

样式方面，为了兼容快应用，布局统一使用flexbox, 不能使用display:block/inline, float,
position:absolute/relative


## 娜娜奇如何和原生小程序兼容，以及其他有用的辅助功能或者工具

娜娜奇不与某一种原生小程序兼容，因为它要照顾4种小程序

如果你的目录名，样式不符合规范，我们在转译阶段会给出友好提示

快应用的文本节点要求放在text, a, option, label下，娜娜奇会在编译阶段自动对没有放在里面的文本包一个text标签

页面配置对象的许多配置项（如tabBar, titBar的配置参数，页面背景参数）， 我们也进行了抹平，用户只需要以微信方式
写，我们自动转换为各个平台对应的名字，在快应用中，是没有tabBar, 我们直接让每个页面组件继承了一个父类，父类里面
有tabBar, 令它长得与其他小程序一模一样

![about](./about.jpg)


