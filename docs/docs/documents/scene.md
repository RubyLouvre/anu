# 场景值的兼容

场景值用来描述用户进入小程序的路径。完整场景值的含义请查看场景值列表。

由于Android系统限制，目前还无法获取到按 Home 键退出到桌面，然后从桌面再次进小程序的场景值，对于这种情况，会保留上一次的场景值。

获取场景值

开发者可以通过下列方式获取场景值：

对于小程序，可以在 App 的 onLaunch 和 onShow，或wx.getLaunchOptionsSync 中获取上述场景值。

```javascript
// app.js
onShow(e){
   console.log(e.scene)
}
```
-----------------
| 场景值 | 场景                            | appId含义  |
|--------|---------------------------------|------------|
| 1020   | 公众号 profile 页相关小程序列表 | 来源公众号 |
| 1035   | 公众号自定义菜单                | 来源公众号 |
| 1036   | App 分享消息卡片                | 来源App    |
| 1037   | 小程序打开小程序                | 来源小程序 |
| 1038   | 从另一个小程序返回              | 来源小程序 |
| 1043   | 公众号模板消息                  | 来源公众号 |

快应用比较相似的API就是app.getInfo

```
app.getInfo({
   success(a){
     console.log(a.type) 
     //来源类型，二级来源，值为 shortcut、push、url、barcode、nfc、bluetooth、other
   }
})
```

-----------------
| 场景值    | 场景             |
|-----------|------------------|
| shortcut  | 快捷方式         |
| push      | 手机弹出的广告   |
| url       | 浏览器           |
| barcode   | 条形码、二维码？ |
| nfc       | NFC              |
| bluetooth | 蓝牙             |

https://doc.quickapp.cn/features/system/app.html?h=getInfo