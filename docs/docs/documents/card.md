
# 卡片

卡片就是一个阉割版的快应用，许多功能与标签都不支持，体积还特别少，放在负一屏中



## VIVO负一屏卡片

1. 卡片使用的是vivo的打包工具 [vivo-hap-toolkit](https://www.npmjs.com/package/vivo-hap-toolkit)
2. 手机端需要安装卡片调试器、卡片引擎
3. 卡片开发是单独一个项目，不要和原有的快应用项目混在一起


## 努比亚卡片
卡片调试需要安装：
1、 Nubia最新快应用引擎nubiaHybridxxx.apk 1.0.3.1以上版本
2、 快应用调试器QuickCardTest.apk

具体调试步骤如下：

1.在手机的sd目录下新建一个文件夹 名称为：quickcard

2.将需要验证的rpk文件拷贝到上面目录下

3.打开QuickCardTest应用加载卡片查看运行效果

4.若rpk有修改调试仅重复步骤2,并最近任务中kill QuickCardTest重新打开即可

注：quickcard下同时只能有一个rpk文件

## OPPO卡片
[OPPO 官方指南](https://open.oppomobile.com/wiki/doc#id=10220)
[OPPO 调试指南](http://storepic.oppomobile.com/openplat/resource/201902/28/%E5%8D%A1%E7%89%87%E5%BC%80%E5%8F%91%E8%B0%83%E8%AF%95FAQ-20190228.pdf)
[OPPO 卡片规范](http://storepic.oppomobile.com/openplat/resource/201811/29/7.1-%E9%99%84%E4%BB%B6-%E5%BF%AB%E5%BA%94%E7%94%A8%E5%8D%A1%E7%89%87%E6%8A%80%E6%9C%AF%E8%A7%84%E8%8C%83V1.6-20181129.pdf)

1.从官方指南中(第一个链接）下载快应用引擎和卡片运行环境安装包到手机上，并分别安装；
2.在手机根目录，创建名称为 rpks 的文件夹；
3.把包含卡片的快应用 rpk 包复制到 rpks 文件夹中；
4.在桌面上找到名为「快应用」的 App 并打开，选择「快应用卡片」，点击相应的卡片（秒开）即可看到卡片；
5.打开卡片后，快应用首页、卡片设置页面（如有）、帐号绑定页面（如有）等，可以在卡片预览页面的最右上角打开。


## 华为搜索卡片

此项目可独立于快应用运行。使用华为快应用 IDE 打开当前目录，连接华为手机，点击 IDE 上方的预览按钮，即可进行调试。调试工具每次只会显示一张卡片，在 IDE 上方的入口中可以选择需要调试的卡片。

所有卡片都在目录 `huaweiCard/` 中。

华为卡片应和快应用主程序一同发布，发布时需要将将卡片合并进主程序中：


## 卡片的配置参数

| 属性                       | 类型    | 必填 | 描述             |
|----------------------------|---------|------|--------------|
| name                       | String  | 是   | 卡片名称                                                                                                                                                                                         |
| description                | String  | 否   | 卡片描述                                                                                                                                                                                         |
| component                  | String  | 是   | 卡片对应的组件名，与 ux 文件名保持一致，例如'hello' 对应'hello.ux'||||                                                                                                                           |
| path                       | String  | 是   | 卡片对应的唯一标识，例如“/user”，不填则默认为/<卡片名称>。path 必须唯一，不能和其他 page/widget 的 path 相同。|
|features                    | Array   |否    |本卡片使用的接口列表，卡片的接口列表单独定义，在某些场景下可以做提前申请（例如负一屏） |
| minPlatformVersion         | Integer | 否   | 支撑的最小平台版本号，不提供则同 rpk 的版本号  |

## VIVO/努比亚卡片manifest.json配置

```json
{
    "router": {
        "widgets": {
            "Card": {
                "name": "nanachi",
                "description": "nanachi快应用，聪明你的旅行",
                "component": "index",
                "path": "/Card",
                "features": [{
                    "name": "system.router"
                }, {
                    "name": "system.fetch"
                }],
                "params": {
                    "title": "noTitle",
                    "height": "53.333%",
                    "enableFold": "false"
                },
                "minPlatformVersion": "1032",
                "targetManufactorys": [
                    "vivo"
                ]
            }
        }
    },
    "display": {}
}
```

## OPPO卡片manifest.json配置


```json
{
    "router": {
        "widgets": {
            "Card": {
                "name": "nanachi",
                "description": "nanachi快应用，聪明你的旅行",
                "component": "index",
                "path": "/oppoCard",
                "features": [{
                    "name": "system.router"
                }, {
                    "name": "system.fetch"
                }],
                "params": {
                    "title": "noTitle",
                    "height": "53.333%",
                    "enableFold": "false"
                },
                "minPlatformVersion": "1032",
                "targetManufactorys": [
                    "oppo"
                ]
            }
        }
    },
    "display": {}
}
```

## 华为卡片manifest.json配置

```json
{
  "package": "com.tujia.quick",
  "name": "nanachi",
  "versionName": "1.0.1",
  "versionCode": 2,
  "icon": "/assets/image/qlog.png",
  "config": {},
  "router": {
    "pages": {
      "huaweiCard/hotel": {
        "component": "index",
        "path": "/huaweiCard/hotel"
      },
      "huaweiCard/flight": {
        "component": "index",
        "path": "/huaweiCard/flight"
      },
      "huaweiCard/travel": {
        "component": "index",
        "path": "/huaweiCard/travel"
      },
      "huaweiCard/ticket": {
        "component": "index",
        "path": "/huaweiCard/ticket"
      },
      "huaweiCard/train": {
        "component": "index",
        "path": "/huaweiCard/train"
      },
      "huaweiCard/vacation": {
        "component": "index",
        "path": "/huaweiCard/vacation"
      }
    }
  },
  "widgets": [
    {
      "name": "tujiaHotel",
      "id": "tujiaHotel",
      "path": "/huaweiCard/hotel",
      "component": "index",
      "targetManufactorys": [
        "huawei"
      ],
      "params": [],
      "uses-permission": [],
      "minPlatformVersion": 1020
    },
    {
      "name": "tujiaFlight",
      "id": "tujiaFlight",
      "path": "/huaweiCard/flight",
      "component": "index",
      "targetManufactorys": [
        "huawei"
      ],
      "params": [],
      "uses-permission": [],
      "minPlatformVersion": 1020
    },
    {
      "name": "tujiaTravel",
      "id": "tujiaTravel",
      "path": "/huaweiCard/travel",
      "component": "index",
      "targetManufactorys": [
        "huawei"
      ],
      "params": [],
      "uses-permission": [],
      "minPlatformVersion": 1020
    },
    {
      "name": "tujiaTicket",
      "id": "tujiaTicket",
      "path": "/huaweiCard/ticket",
      "component": "index",
      "targetManufactorys": [
        "huawei"
      ],
      "params": [],
      "uses-permission": [],
      "minPlatformVersion": 1020
    },
    {
      "name": "tujiaTrain",
      "id": "tujiaTrain",
      "path": "/huaweiCard/train",
      "component": "index",
      "targetManufactorys": [
        "huawei"
      ],
      "params": [],
      "uses-permission": [],
      "minPlatformVersion": 1020
    },
    {
      "name": "tujiaVacation",
      "id": "tujiaVacation",
      "path": "/huaweiCard/vacation",
      "component": "index",
      "targetManufactorys": [
        "huawei"
      ],
      "params": [],
      "uses-permission": [],
      "minPlatformVersion": 1020
    }
  ],
  "minPlatformVersion": 1040,
  "display": {
    "backgroundColor": "#f2f2f2",
    "titleBarBackgroundColor": "#f2f2f2"
  },
  "features": [
    {
      "name": "system.router"
    },
    {
      "name": "system.fetch"
    }
  ]
}
```