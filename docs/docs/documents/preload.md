# 分包预加载



开发者可以通过配置，在进入小程序某个页面时，由框架自动预下载可能需要的分包，提升进入后续分包页面时的启动速度。
对于独立分包，也可以预下载主包。

分包预加载有只支持通过配置方式使用，暂不支持通过调用API完成。

> vConsole 里有preloadSubpackages开头的日志信息，可以用来验证预下载的情况。

```json
{
  "pages": ["pages/platform/index/index",
       "pages/platform/pay/index",
       "pages/platform/about/index"],
  "subpackages": [
    {
      "root": "flight",
      "pages": ["index"],
    },
    {
      "root": "train",
      "pages": ["index"],
    },
    {
      "name": "hotel",
      "root": "index",
      "pages": ["index"]
    },
    {
      "root": "strategy",
      "pages": ["index"]
    },
     {
      "root": "boat",
      "pages": ["index"]
     },
      {
      "root": "taxi",
      "pages": ["index"]
     },
  ],
  "preloadRule": {
    "pages/platform/index/index": { //首页
      "network": "all",
      "packages": ["flight", "train","hotel"] //一级分包或随机加载一级分包
    },
    "pages/flight/index/index": { 
      "packages": ["strategy","boat", "taxi"] //二级分包或随机加载二级分包
    },
    "pages/train/index/index": {
      "packages":  ["strategy","boat", "taxi"] //二级分包或随机加载二级分包
    },
    "pages/hotel/index/index": {
      "packages":  ["strategy","boat", "taxi"] //二级分包或随机加载二级分包
    },
     "pages/strategy/index/index": {
      "packages":  [ "boat", "taxi"] //二级分包中除自己的包
    },
     "pages/boat/index/index": {
      "packages":  ["strategy", "taxi"] //二级分包中除自己的包
    },
     "pages/taxi/index/index": {
      "packages":  ["strategy", "boat"] //二级分包中除自己的包
    }
  }
}
```
比较新的支付宝，百度的开发者工具，preloadRule的分包可以简略成以包名开头，即

```json
{
  "pages": ["pages/platform/index/index",
       "pages/platform/pay/index",
       "pages/platform/about/index"],
  "subpackages": [
    {
      "root": "flight",
      "pages": ["index"],
    },
    {
      "root": "train",
      "pages": ["index"],
    },
    {
      "name": "hotel",
      "root": "index",
      "pages": ["index"]
    },
    {
      "root": "strategy",
      "pages": ["index"]
    },
     {
      "root": "boat",
      "pages": ["index"]
     },
      {
      "root": "taxi",
      "pages": ["index"]
     },
  ],
  "preloadRule": {
    "pages/platform/index/index": { //首页
      "network": "all",
      "packages": ["flight", "train","hotel"] //一级分包或随机加载一级分包
    },
    "flight/index/index": { 
      "packages": ["strategy","boat", "taxi"] //二级分包或随机加载二级分包
    },
    "train/index/index": {
      "packages":  ["strategy","boat", "taxi"] //二级分包或随机加载二级分包
    },
    "hotel/index/index": {
      "packages":  ["strategy","boat", "taxi"] //二级分包或随机加载二级分包
    },
     "strategy/index/index": {
      "packages":  [ "boat", "taxi"] //二级分包中除自己的包
    },
     "boat/index/index": {
      "packages":  ["strategy", "taxi"] //二级分包中除自己的包
    },
    "taxi/index/index": {
      "packages":  ["strategy", "boat"] //二级分包中除自己的包
    }
  }
}
```

```shell

|--pages
     |--platform //这里我们将platform当作主包
     |   |--index //index目录总是对应某个业务线的主页
     |   |    └──index.js //当前频道的首页, 最好统一叫index
     |   |--about
     |   |    |---index.js
     |   |    └── index.scss
     |   └──pay
     |        |---index.js
     |        └── index.scss
     |--train 
     |--hotel  
     |--taxi  

```
![preload](./preload.jpg)


preloadRule 中，key 是页面路径，value 是进入此页面的预下载配置，每个配置有以下几项：

| 字段     | 类型        | 必填 | 默认值 | 说明                                                                         |
|----------|-------------|------|--------|------------------------------------------------------------------------------|
| packages | StringArray | 是   | 无     | 进入页面后预下载分包的 root 或 name。__APP__ 表示主包。                      |
| network  | String      | 否   | wifi   | 在指定网络下预下载，可选值为：<br />all: 不限网络 <br />wifi: 仅wifi下预下载 |


> 支付宝的分包与分包预加载都是支持得比较晚，支付宝客户端 10.1.60+ 或 小程序开发者工具 0.40+才开始支持。到2019.6.3，才升级到10.1.65，
因此不建议对支付宝小程序进行分包。

大家可以建一个去哪儿模板来体验一下

```shell
nanachi init aaa
选中qunar
cd aaa && npm i
nanachi watch
```
