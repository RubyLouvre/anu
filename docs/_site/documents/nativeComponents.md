## 不转译某些标签名

像微信，支付宝，它们总是不断推出新的标签，如live-player,live-pusher...

对于这些原生组件签标，nanachi是不做转译，因此我们有一个列表来放置这些标签，告诉转译器不做处理，否则都转换成view

![helper](./nativeComponents.png)

![helper2](./nativeComponents2.png)

但是我们可能盯得没有这么紧，当厂商推出一个新标签时，我们还没有新版本时，用户怎么办，不能干等吧。因此我们推出一个新配置，在
wxConfig.json, aliConfig.json, buConfig.json, quickConfig.json, 360Config.json ...

叫做**nativeComponents**，它对应一个字符串数组，里面是你不想转译的标签名


```json
{
    "package": "com.qunar.quick",
    "name": "去哪儿旅行",
    "versionName": "3.0.7",
    "versionCode": 57,
    "minPlatformVersion": 1030,
    "icon": "/assets/image/qlog.png",
     "nativeComponents": ["life-follow","xxxx"],
    "features": [
        {
            "name": "service.wxpay",
            "params": {
                "url": "https://xxx.yyy.com/touch/wechatTransition"
            }
        }
    ],
}
```