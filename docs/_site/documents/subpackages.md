# 分包加载

某些情况下，开发者需要将小程序划分成不同的子包，在构建时打包成不同的分包，用户在使用时按需进行加载。

此功能已经被各种小程序支持了，这个能有效提升我们打开小程序的速度。

## 小程序使用

微信上，在source/app.js目录下建立一个wxConfig.json或 buConfig.json...

假设我们的目录结构是这样：


```shell
src
   |--components
   |    |--HotelDialog     // 这里的组件会全部打入主包中
   |    |--HotelUm
   |    |--Flight2
   |    └── ...
   |--pages
   |    |--hotel
   |    |   └── components
   |    |         |--HotelXX1     // 这里的组件会打到hotel分包中
   |    |         |--HotelXX2
   |    |         |--HotelXX3
   |    |         └── ...
   |    |--flight
   |    |   └── components
   |    |         |--FlightXX1     // 这里的组件会打到flight分包中
   |    |         |--FlightXX2
   |    |         |--FlightXX3
   |    |         └── ...
   |    |--holiday
   |    |--strategy
   |    └──platform
   |         |--index
   |         |--page1
   |         └── ...
   |--assets 
   |    |--style
   |--common
   |    |--hotel
   |    |--flight
   |    |--holiday
   |    |--strategy
   |    └──platform
   |--app.js
   |--wxConfig.json
   |--qqConfig.json
   |--quickConfig.json
   |--aliConfig.json
   |--buConfig.json
```

我们将pages/platform目录当成主包，那应该包含首页，tabBar list里面指向几个页面， 收银台，订单中心，会员中心，
卡包等重要功能。主包也会包含src下面的components， common，assets 的所有功能。

而其他子包， 则只能在pages的直接目录，hotel，ticket， holiday，strategy各自成包。wxConfig.json中的
subpackages数组只用定义这几个目录就行了。

```json
{
    "subpackages": [
        {
            "name": "hotel",
            "resource": "pages/hotel"
        },
        {
            "name": "ticket",
            "resource": "pages/ticket"
        },
        {
            "name": "train",
            "resource": "pages/train"
        },
        {
            "name": "vacation",
            "resource": "pages/vacation"
        }
    ]
}
```
会自动翻译成下面的内容放到app.json中

```json
{
     "subpackages": [ //百度下会编译为subPackages
    {
      "root": "pages/hotel",
      "name": "hotel",
      "pages": ["index","page1","page2","page3","page4"]
    },
    {
      "root": "pages/ticket",
      "name": "ticket",
      "pages": ["index","list","coupon/coupon", "detail" ]
    },
    {
      "root": "pages/train",
      "name": "train",
      "pages": ["index","aaa","bbb","ccc"]
    },
    {
      "root": "pages/vacation",
      "name": "vacation",
      "pages": ["index","aaa","bbb","ccc"]
    },
  ]
}
```


subpackages 中，每个分包的配置有以下几项：

|    字段     |    类型     |              说明              |
|:-----------:|:-----------:|:------------------------------:|
|    root     |   String    |           分包根目录           |
|    name     |   String    | 分包别名，分包预下载时可以使用 |
|    pages    | StringArray | 分包页面路径，相对与分包根目录 |
| independent |   Boolean   |       分包是否是独立分包       |

## 快应用的分包加载

在app.js同一目录下，建一个quickConfig.json。里面内部为

```json
{
    "subpackages": [
        {
            "name": "hotel",
            "resource": "pages/hotel"
        },
        {
            "name": "ticket",
            "resource": "pages/ticket"
        },
        {
            "name": "train",
            "resource": "pages/train"
        },
        {
            "name": "vacation",
            "resource": "pages/vacation"
        }
    ]
}
```

它们会自动加入manifest.json中

> 没错，我们的wxConfig.json, buConfig.json, quickConfig.json里面的分包配置就是根据快应用的设计过来的，然后我们再转译成各个平台要求的样式。

## 打包原则

声明 subpackages 后，将按 subpackages 配置路径进行打包，subpackages 配置路径外的目录将被打包到 app（主包） 中
app（主包）也可以有自己的 pages（即最外层的 pages 字段）
subpackage 的根目录不能是另外一个 subpackage 内的子目录
tabBar 页面必须在 app（主包）内

## 引用原则

packageA 无法 require packageB JS 文件，但可以 require app、自己 package 内的 JS 文件
packageA 无法 import packageB 的 template，但可以 require app、自己 package 内的 template
packageA 无法使用 packageB 的资源，但可以使用 app、自己 package 内的资源
主包会包含所有source/components中的所有组件， 为了减少主包的大小， 某些频道涉及的页面与组全应该放在pages下的某一目录下。详见[这里](./publish.md)


![subpackages](./subpackages.jpg)

> 快应用分包体积过大时的警告

## 坑

小程序的打包机制仅仅是根据文件目录打包，分包内require/import的任何文件，只要不在同一个目录下面，都不会被打进分包，也就是说，类库及一些公共文件，只能放在主包里面，如果主包分包划分不好的话，主包的大小也很难降下来

安卓系统进入分包页面时，会出现一个丑陋的系统级的loading层，这一定程度上影响了安卓的体验


## 低版本兼容

由微信后台编译来处理旧版本客户端的兼容，后台会编译两份代码包，一份是分包后代码，另外一份是整包的兼容代码。 新客户端用分包，老客户端还是用的整包，完整包会把各个 subpackage 里面的路径放到 pages 中。

目前 字节跳动小程序不支持分包