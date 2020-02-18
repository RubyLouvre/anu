# 位置

## getLocation(Object object)

获取当前的地理位置、速度。当用户离开小程序后，此接口无法调用。


注：支付宝和微信小程序参数都不一致

**参数**

Object object

| 属性     | 类型          | 默认值 | 是否必须 | 说明                                             | 支持平台 |
| -------- | ------------- | ------ | -------- | ------------------------------------------------ | ------------------|
| type  | string     |   wgs84     | 是      | wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标	                           |微信小程序，百度小程序|
| altitude     | string      |    false    |否       | 传入 true 会返回高度信息，由于获取高度需要较高精确度，会减慢接口返回速度  |微信小程序>=1.6.0，百度小程序
| success  | function      |        | 否       | 接口调用成功的回调函数                           |微信小程序，百度小程序|
| fail     | function      |        | 否       | 接口调用失败的回调函数                           |微信小程序，百度小程序|
| complete | function      |        | 否       | 接口调用结束的回调函数（调用成功、失败都会执行） |微信小程序，百度小程序|

object.success 回调函数

参数

Object res

| 属性    | 类型    | 说明                               | 支持平台 |
| ------- | ------- | ---------------------------------- | -------- |
| latitude | number | 纬度，范围为 -90~90，负数表示南纬 | 微信小程序，百度小程序   |
| longitude | number | 经度，范围为 -180~180，负数表示西经 | 微信小程序，百度小程序   |
| speed | number | 速度，单位 m/s | 微信小程序，百度小程序   |
| accuracy | number | 位置的精确度 | 微信小程序，百度小程序   |
| altitude | number | 高度，单位 m | 微信小程序>= 1.2.0，百度小程序   |
| verticalAccuracy | number | 垂直精度，单位 m（Android 无法获取，返回 0） | 微信小程序>= 1.2.0，百度小程序   |
| horizontalAccuracy | number | 水平精度，单位 m | 微信小程序>= 1.2.0，百度小程序   |
| street | string | 街道名称 | 百度小程序   |
| cityCode | string | 城市编码 | 百度小程序   |
| city | string | 城市名称 | 百度小程序   |
| country | string | 国家 | 百度小程序   |
| province | string | 省份 | 百度小程序   |
| streetNumber | string | 街道号码 | 百度小程序   |
| district | string | 区 | 百度小程序   |



代码示例

```javascript
React.api.getLocation({
  type: 'gcj02',
  success: function (res) {
     console.log('纬度：' + res.latitude);
     console.log('经度：' + res.longitude);
  },
  fail: function (err) {
     console.log('错误码：' + err.errCode);
     console.log('错误信息：' + err.errMsg);
  }
})
```

## openLocation(Object object)

内置地图查看位置

**参数**

Object object

| 属性     | 类型          | 默认值 | 是否必须 | 说明                                             |
| -------- | ------------- | ------ | -------- | ------------------------------------------------ |
| longitude  | Number     |        | 是      | 经度，范围为-90~90，负数表示南纬。使用 gcj02 国测局坐标系                           |
| latitude     | Number      |        |是       | 纬度，范围为-90~90，负数表示南纬。使用 gcj02 国测局坐标系                           |
| scale | Number      |    18    | 否       | 缩放比例，范围5~18 |
| name  | string      |        | 否       | 位置名                           |
| address     | string      |        | 否       | 地址的详细说明                           |
| success  | function      |        | 否       | 接口调用成功的回调函数                           |
| fail     | function      |        | 否       | 接口调用失败的回调函数                           |
| complete | function      |        | 否       | 接口调用结束的回调函数（调用成功、失败都会执行） |


代码示例

```javascript
React.api.getLocation({
  type: 'gcj02',
  success: function (res) {
    React.api.openLocation({
      latitude: res.latitude,
      longitude: res.longitude,
      scale: 18
     })
  },
  fail: function (err) {
    console.log('错误码：' + err.errCode);
    console.log('错误信息：' + err.errMsg);
  }
});
```
## chooseLocation(Object object)

打开地图选择位置

**参数**

Object object
| 属性     | 类型          | 默认值 | 是否必须 | 说明                                             |
| -------- | ------------- | ------ | -------- | ------------------------------------------------ |
| success  | function      |        | 否       | 接口调用成功的回调函数                           |
| fail     | function      |        | 否       | 接口调用失败的回调函数                           |
| complete | function      |        | 否       | 接口调用结束的回调函数（调用成功、失败都会执行） |

**object.success 回调函数**

Object res

| 属性     | 类型          | 默认值 | 是否必须 | 说明                                             |
| -------- | ------------- | ------ | -------- | ------------------------------------------------ |
| name  | string      |        | 否       | 位置名                           |
| address     | string      |        | 否       | 地址的详细说明                           |
| longitude  | String     |        | 是      | 经度，范围为-90~90，负数表示南纬。使用 gcj02 国测局坐标系                           |
| latitude     | String      |        |是       | 纬度，范围为-90~90，负数表示南纬。使用 gcj02 国测局坐标系                           |

