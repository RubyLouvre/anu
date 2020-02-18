# 开发目录结构与输出目录指定

在开始之前，提一下两种重要的概念。带JSX的页面组件与通用组件，它们分别放在pages与components目录下，它们具有巨大的转换成本（毕竟JSX会被提取出来转换成wxml, axml, swan或ux文件），还有一种不带JSX的纯JS文件，建议放在common目录,  当然还有一些通用的东西可以通过npm安装，但不要使用那些有JSX的第三方依赖。静态资图（图片，iconfont, 样式文件）放在assets目录。 


开发目录如下
```jsx
src
   |--components
   |    |--HotelDialog     // 这里的组件是不打算分包，会全部打入主包中
   |    |     └──index.js  //必须以index.js命名，里面的类名 必须 与文件夹名一样, 如HotelDialog
   |    |--HotelXXX
   |    |--FlightYYY
   |    └── ...
   |--assets 
   |    |--style
   |--common
   |    |--hotel
   |    |--flight
   |    |--holiday
   |    |--strategy
   |    └── ...
   |--pages
   |    |--hotel
   |    |--flight
   |    |--holiday
   |    |--strategy
   |    └── ...
   |--app.js
   |--sign 
   |--wxConfig.json
   |--qqConfig.json
   |--quickConfig.json
   |--aliConfig.json
   |--buConfig.json
```

components目录下为了扁平化管理，以事业部为前缀+组件名的方式定义组子目录，目录下面就是index.js, index.scss或index.less。index.js里面必须是React组件，需要显式引入｀import React from "@react"`



>components目录下不要使用Fragments来命名子目录，这留给系统用。

pages目录下每个事业部各建一个目录，以事业部的名字命名，里面结构为了分包需要，也包含自己的components,
common, assets, index目录，及其他页面的目录。

![publish](./publish.png)

source中的sign目录是快应用的签名目录，在发布时拷贝到外面

页面目录应该只包含index.js与index.css(也可以改成index.less, index.scss). 注意，必须用index命名，并且里面必须是有状态的React组件（转译器会转换成页面组件。）页面的index.js各种引入通用组件与common目录的依赖

```jsx
   |--pages
   |    |--hotel
            |--index
            |    └──index.js //当前频道的首页, 最好统一叫index
            |--page1         //page1目录下只能存在**2**个以index命名的文件，一个是js，一个是样式
            |    |---index.js
            |    └── index.scss
            |--page2
            |    |---index.js
            |    └── index.scss
            |--page3
            |    |---index.js
            |    └── index.scss
            |--about
            |    |---index.js
            |    └── index.scss
            └──-components //这里的组件要分包，会全部打入hotel分包中
                |--HotelDialog
                |     └──index.js  
                |--HotelXXX
                |--HotelYYY
                └── ...
```

common目录下每个事业部各建一个目录，以事件部的名字命名，里面为各种JS文件，它们只是纯业务逻辑，没有JSX，只会经过es67的语法糖转换。


source/app.js会引入pages每个事件的index.js, 只要稍微分析就得到整个应用全部有效的页面，放到app.json的pages数组中，或快应用的manifest.json的router对象的pages对象中


共享数据的处理， 大家都在globalData对象中放一些命名空间对象. globalData不能放函数。大家不要放在其他全局对象上，因此在快应用等个别小程序中，页面跳转时，会清空掉除globalData之外的数据与变量。

qqConfig.json , wxConfig.json这些平台特有的配置项

```javascript
{
    globalData: {
        flight: {
            xxx:111,222:444
        },
        hotel: {

        }
    }
}
```

## 自定义输出目录
nanachi 默认打包目录是dist, 可以在package.json中自定义配置 buildDir 来定义打包目录。

```javascript
{
    "nanachi": {
        "alias": {
            "@style": "source/assets/style"
        },
        "buildDir": "yourDir"
    }
}
```

## 压缩打包
执行 `nanachi build -c` 会将项目中css, js进行压缩。