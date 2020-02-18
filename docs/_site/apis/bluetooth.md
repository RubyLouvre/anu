
# 蓝牙

## openBluetoothAdapter(OBJECT)

初始化小程序蓝牙模块，生效周期为调用wx.openBluetoothAdapter至调用wx.closeBluetoothAdapter或小程序被销毁为止。 在小程序蓝牙适配器模块生效期间，开发者可以正常调用下面的小程序API，并会收到蓝牙模块相关的on回调。

**参数**

Object object

| 参数名     | 类型          |是否必须 | 说明                                             |支持平台|
| -------- | ------------- | -------- | ----------------------------------------|-------- |
| autoClose      | Boolean        |       否       | 不传的话默认是true，表示是否在离开当前页面时自动断开蓝牙(仅对android有效)                          |支付宝|
| success  | function      |  是       | 接口调用成功的回调函数                           |都支持|
| fail     | function      |         否       | 接口调用失败的回调函数                           |都支持|
| complete | function      |        否       | 接口调用结束的回调函数（调用成功、失败都会执行） |都支持|

注意

> 其他蓝牙相关 API 必须在 wx.openBluetoothAdapter 调用之后使用。否则 API 会返回错误（errCode=10000）

> 在用户蓝牙开关未开启或者手机不支持蓝牙功能的情况下，调用 wx.openBluetoothAdapter 会返回错误（errCode=10001），表示手机蓝牙功能不可用。此时小程序蓝牙模块已经初始化完成，可通过 wx.onBluetoothAdapterStateChange 监听手机蓝牙状态的改变，也可以调用蓝牙模块的所有API。

## closeBluetoothAdapter(Object object)

关闭蓝牙模块。调用该方法将断开所有已建立的连接并释放系统资源。建议在使用蓝牙流程后，与 wx.openBluetoothAdapter 成对调用。

**参数**

Object object

| 参数名     | 类型          |是否必须 | 说明                                             |支持平台|
| -------- | ------------- | -------- | ----------------------------------------|-------- |
| success  | function      |  是       | 接口调用成功的回调函数                           |都支持|
| fail     | function      |         否       | 接口调用失败的回调函数                           |都支持|
| complete | function      |        否       | 接口调用结束的回调函数（调用成功、失败都会执行） |都支持|


