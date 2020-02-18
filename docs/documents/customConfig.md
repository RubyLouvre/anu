# 自定义项目配置

用户可以自定义项目配置

需要在项目根目录里新建类似`quickConfig.json`,`wxConfig`这样独立的配置文件。

```shell
├── package.json
├── quickConfig.json
└── source
```


比如 quickConfig.json，需要指定快应用引擎，微信支付，分包
配置文件内容参照快应用 [manifest.json](https://doc.quickapp.cn/framework/manifest.html) 配置文档。

```json
{
    "package": "com.qunar.quick",
    "name": "去哪儿旅行",
    "versionName": "3.0.7",
    "versionCode": 57,
    "minPlatformVersion": 1030,
    "icon": "/assets/image/qlog.png",
    "features": [
        {
            "name": "service.wxpay",
            "params": {
                "url": "https://xxx.yyy.com/touch/wechatTransition"
            }
        }
    ],
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

又如 wxConfig.json需要处理权限
参见https://developers.weixin.qq.com/miniprogram/dev/reference/configuration/app.html

```json
{
    "permission": {
    "scope.userLocation": {
      "desc": "你的位置信息将用于小程序位置接口的效果展示"
    }
  }
}
```


