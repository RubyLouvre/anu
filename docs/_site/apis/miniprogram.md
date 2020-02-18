# 设备

## 振动

## vibrateLong(Object object)

使手机发生较长时间的振动（400 ms)


**参数**
Object object

| 属性         | 类型     | 默认值 | 是否必须 | 说明                 |支持平台|
| ------------ | -------- | ------ | -------- | --------------------------------------------------------------------------|----------------- | -------- |
| success      | function |        | 否       | 接口调用成功的回调函数          |    微信， 百度，支付宝                                                                                                         |
| fail         | function |        | 否       | 接口调用失败的回调函数          |       微信，百度，支付宝                                                                                                     |
| complete     | function |        | 否       | 接口调用结束的回调函数（调用成功、失败都会执行）                                                                                            |微信， 百度，支付宝                                                                                  |
## vibrateShort(Object object)

**参数**
Object object

| 属性         | 类型     | 默认值 | 是否必须 | 说明                 |支持平台|
| ------------ | -------- | ------ | -------- | --------------------------------------------------------------------------|----------------- | -------- |
| success      | function |        | 否       | 接口调用成功的回调函数          |    微信， 百度，支付宝                                                                                                         |
| fail         | function |        | 否       | 接口调用失败的回调函数          |       微信，百度，支付宝                                                                                                     |
| complete     | function |        | 否       | 接口调用结束的回调函数（调用成功、失败都会执行）                                                                                            |微信， 百度，支付宝                                                                                  |

## 电话

## makePhoneCall(Object object)

**参数**
Object object

| 属性         | 类型     | 默认值 | 是否必须 | 说明                 |支持平台|
| ------------ | -------- | ------ | -------- | ------------------------------------------------------------------------------------------- | -------- |
|phoneNumber      | string|        | 否       |需要拨打的电话号码                                                                                                                     |
| success      | function |        | 否       | 接口调用成功的回调函数       |微信                                                                                                               |
| fail         | function |        | 否       | 接口调用失败的回调函数                                                                                                                      |
| complete     | function |        | 否       | 接口调用结束的回调函数（调用成功、失败都会执行）                                                                                            |


## 网络

## getNetworkType(Object object)

获取网络类型

**参数**
Object object

| 属性         | 类型     | 默认值 | 是否必须 | 说明                 |
| ------------ | -------- | ------ | -------- | ------------------------------------------------------------------------------------------- | -------- |
| success      | function |        | 否       | 接口调用成功的回调函数                                                                                                                      |
| fail         | function |        | 否       | 接口调用失败的回调函数                                                                                                                      |
| complete     | function |        | 否       | 接口调用结束的回调函数（调用成功、失败都会执行）                                                                                            |


**object.success 回调函数**

Object res

| 属性       | 类型   | 描述                                       |支持平台|
| ---------- | ------ | ------------------------|------------------ |
| networkType       | string | 网络类型值 unknown / NOTREACHABLE(支付宝) / WWAN(支付宝) / wifi / 3g / 2g / 4g / none(百度、微信) |都支持|
| networkAvailable | Number |网络是否可用           |支付宝|



## onNetworkStatusChange(function callback)

监听网络状态变化事件

**参数**

function callback
网络状态变化事件的回调函数

**object.success 回调函数**

Object res

| 属性       | 类型   | 描述                                       |支持平台|
| ---------- | ------ | ------------------------|------------------ |
| networkType       | string | 网络类型值 unknown / NOTREACHABLE(支付宝) / WWAN(支付宝) / wifi / 3g / 2g / 4g / none(百度、微信)  |都支持|
| isConnected | boolean |当前是否有网络链接           |都支持|

## 剪切板

##  getClipboardData(Object object)

获取系统剪贴板的内容

**参数**
Object object

| 属性         | 类型     | 默认值 | 是否必须 | 说明                 |
| ------------ | -------- | ------ | -------- | ------------------------------------------------------------------------------------------- | -------- |
| success      | function |        | 否       | 接口调用成功的回调函数                                                                                                                      |
| fail         | function |        | 否       | 接口调用失败的回调函数                                                                                                                      |
| complete     | function |        | 否       | 接口调用结束的回调函数（调用成功、失败都会执行）                                                                                            |

**object.success 回调函数**

Object res

| 属性       | 类型   | 描述                                       |
| ---------- | ------ | ------------------------|------------------ |
| data       | string | 剪贴板的内容

##  setClipboardData(Object object)

设置系统剪贴板的内容

**参数**
Object object

| 属性         | 类型     | 默认值 | 是否必须 | 说明                 |
| ------------ | -------- | ------ | -------- | ------------------------------------------------------------------------------------------- | -------- |
| data      | string |        | 是      | 剪贴板的内容                                                                                                                     |
| success      | function |        | 否       | 接口调用成功的回调函数                                                                                                                      |
| fail         | function |        | 否       | 接口调用失败的回调函数                                                                                                                      |
| complete     | function |        | 否       | 接口调用结束的回调函数（调用成功、失败都会执行）                                                                                            |

## 屏幕

## setKeepScreenOn(Object object)

设置是否保持屏幕长亮状态。仅在当前小程序生效，离开小程序后失效。

**参数**
Object object

| 参数         | 类型     | 默认值 | 是否必须 | 说明                 |
| ------------ | -------- | ------ | -------- | ------------------------------------------------------------------------------------------- | -------- |
| keepScreenOn      | Boolean |        | 是      |是否保持屏幕长亮状态                                                                                                                    |
| success      | function |        | 否       | 接口调用成功的回调函数                                                                                                                      |
| fail         | function |        | 否       | 接口调用失败的回调函数                                                                                                                      |
| complete     | function |        | 否       | 接口调用结束的回调函数（调用成功、失败都会执行）                                                                                            |


## getScreenBrightness(Object object)

获取屏幕亮度

**参数**
Object object

| 参数         | 类型     | 默认值 | 是否必须 | 说明                 |
| ------------ | -------- | ------ | -------- | ------------------------------------------------------------------------------------------- | -------- |
| success      | function |        | 否       | 接口调用成功的回调函数                                                                                                                      |
| fail         | function |        | 否       | 接口调用失败的回调函数                                                                                                                      |
| complete     | function |        | 否       | 接口调用结束的回调函数（调用成功、失败都会执行）                                                                                            |

## setScreenBrightness(OBJECT)

设置屏幕亮度

**参数**
Object object

| 参数         | 类型     | 默认值 | 是否必须 | 说明                 |
| ------------ | -------- | ------ | -------- | ------------------------------------------------------------------------------------------- | -------- |
| value      | Number |        | 是       | 屏幕亮度值，范围 0 ~ 1。0 最暗，1 最亮                                                                                                                      |
| success      | function |        | 否       | 接口调用成功的回调函数                                                                                                                      |
| fail         | function |        | 否       | 接口调用失败的回调函数                                                                                                                      |
| complete     | function |        | 否       | 接口调用结束的回调函数（调用成功、失败都会执行）                                                                                            |

## boolean canIUse(string schema)

判断小程序的API，回调，参数，组件等是否在当前版本可用。


**参数**
string schema


使用 ${API}.${method}.${param}.${options} 或者 ${component}.${attribute}.${option} 方式来调用

**返回值**

boolean
当前版本是否可用

参数说明
* ${API} 代表 API 名字
* ${method} 代表调用方式，有效值为return, success, object, callback
* ${param} 代表参数或者返回值
* ${options} 代表参数的可选值
* ${component} 代表组件名字
* ${attribute} 代表组件属性
* ${option} 代表组件属性的可选值


代码示例：

```javascript
React.api.canIUse('getFileInfo')
React.api.canIUse('closeSocket.object.code')
React.api.canIUse('getLocation.object.type')
React.api.canIUse('getSystemInfo.return.brand')
React.api.canIUse('lifestyle')
React.api.canIUse('button.open-type.share')
```


## 系统信息

## getSystemInfo(Object object)

获取系统信息

**参数**

Object object

| 属性     | 类型     | 是否必须 | 说明                                                        | 支持平台 |
| -------- | -------- | -------- | ----------------------------------------------------------- | -------- |
| src      | string   | 是       | 图片路径，目前支持：网络图片路径、apFilePath 路径、相对路径 | 都支持   |
| success  | function | 否       | 接口调用成功的回调函数                                      | 都支持   |
| fail     | function | 否       | 接口调用失败的回调函数                                      | 都支持   |
| complete | function | 否       | 接口调用结束的回调函数（调用成功、失败都会执行）            | 都支持   |

**success 返回值**

| 名称        | 类型   | 描述                | 支持平台 |
| ----------- | ------ | ------------------- | -------- |
| brand       | string | 手机品牌 | 都支持   |
| model      | string | 手机型号 | 都支持   |
| pixelRatio        | number | 设备像素比 | 都支持   |
| screenWidth | number | 屏幕宽度 | 都支持     |
| screenHeight        | number | 屏幕高度 | 都支持     |
| windowWidth        | number | 可使用窗口宽度 | 都支持     |
| windowHeight        | number | 可使用窗口高度 | 都支持     |
| statusBarHeight        | number | 状态栏的高度 | 百度、微信     |
| language        | string | 微信设置的语言 | 都支持     |
| version        | string | 版本号 | 都支持     |
| system        | string | 操作系统版本 | 都支持     |
| platform        | string | 客户端平台 | 都支持     |
| fontSizeSetting        | string | 用户字体大小设置。以“我-设置-通用-字体大小”中的设置为准，单位 px | 都支持     |
| SDKVersion        | string | 客户端基础库版本 | 百度、微信     |
| storage        | string | 设备磁盘容量 | 支付宝 |
| currentBattery        | string | 当前电量百分比 | 支付宝 |
| app        | string | 当前运行的客户端，当前是支付宝则有效值是"alipay" | 支付宝 |
| benchmarkLevel        | string | (仅Android小游戏) 性能等级，-2 或 0：该设备无法运行小游戏，-1：性能未知，>=1 设备性能值，该值越高，设备性能越好 (目前设备最高不到50) | 微信 |

## getSystemInfoSync(Object object)[快应用不支持]

同步获取系统信息

**返回值Object**

| 名称        | 类型   | 描述                | 支持平台 |
| ----------- | ------ | ------------------- | -------- |
| brand       | string | 手机品牌 | 都支持   |
| model      | string | 手机型号 | 都支持   |
| pixelRatio        | number | 设备像素比 | 都支持   |
| screenWidth | number | 屏幕宽度 | 都支持     |
| screenHeight        | number | 屏幕高度 | 都支持     |
| windowWidth        | number | 可使用窗口宽度 | 都支持     |
| windowHeight        | number | 可使用窗口高度 | 都支持     |
| statusBarHeight        | number | 状态栏的高度 | 百度、微信     |
| language        | string | 微信设置的语言 | 都支持     |
| version        | string | 版本号 | 都支持     |
| system        | string | 操作系统版本 | 都支持     |
| platform        | string | 客户端平台 | 都支持     |
| fontSizeSetting        | string | 用户字体大小设置。以“我-设置-通用-字体大小”中的设置为准，单位 px | 都支持     |
| SDKVersion        | string | 客户端基础库版本 | 百度、微信     |
| storage        | string | 设备磁盘容量 | 支付宝 |
| currentBattery        | string | 当前电量百分比 | 支付宝 |
| app        | string | 当前运行的客户端，当前是支付宝则有效值是"alipay" | 支付宝 |
| benchmarkLevel        | string | (仅Android小游戏) 性能等级，-2 或 0：该设备无法运行小游戏，-1：性能未知，>=1 设备性能值，该值越高，设备性能越好 (目前设备最高不到50) | 微信 |

## 扫码

## scanCode(Object object)

调起客户端扫码界面进行扫码

**参数**

Object object

| 属性     | 类型     | 是否必须 | 说明                                                        | 支持平台 |
| -------- | -------- | -------- | ----------------------------------------------------------- | -------- |
| onlyFromCamera      | boolean   | 否       | 是否只能从相机扫码，不允许从相册选择图片，默认false | 都支持,快应用不支持   |
| scanType      | Array.<string>   | 否       | 扫码类型，默认(微信)['barCode', 'qrCode'], 支付宝默认值['qrCode'],数组只识别第一个 | 都支持， 快应用不支持   |
| success  | function | 否       | 接口调用成功的回调函数                                      | 都支持   |
| fail     | function | 否       | 接口调用失败的回调函数                                      | 都支持   |
| complete | function | 否       | 接口调用结束的回调函数（调用成功、失败都会执行）            | 都支持   |

**object.scanType 的合法值**



| 值       | 描述                | 支持平台 |
| ----------- | ------------------- | -------- |
| barCode       |  一维码 | 都支持   |
| qrCode     | 二维码 | 都支持   |
| datamatrix        |  Data Matrix 码 | 微信  |
| pdf417 |  PDF417 条码 | 微信     |

**success 返回值**

| 名称        | 类型   | 描述                | 支持平台 |
| ----------- | ------ | ------------------- | -------- |
| result       | string | 所扫码的内容 | 都支持   |
| scanType      | string | 所扫码的类型 | 支付宝不支持   |
| charSet        | string | 所扫码的字符集 | 支付宝不支持   |
| qrCode        | string |扫描二维码时返回二维码数据 | 支付宝   |
|  barCode       | string | 扫描条形码时返回条形码数据 | 支付宝   |
| path | number | 当所扫的码为当前小程序的合法二维码时，会返回此字段，内容为二维码携带的 path | 微信     |
| rawData        | string | 原始数据，base64编码 | 微信     |

## 用户截屏事件

## onUserCaptureScreen(Object object)

监听用户主动截屏事件，用户使用系统截屏按键截屏时触发此事件。

**参数callback**
```javascript
React.api.onUserCaptureScreen(function() {
    console.log('用户截屏了')
});
```
