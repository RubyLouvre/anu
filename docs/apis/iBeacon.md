
# iBeacon

## startBeaconDiscovery(OBJECT)

开始搜索附近的iBeacon设备

**参数**

Object object

| 参数名     | 类型          |是否必须 | 说明                                             |
| -------- | ------------- | -------- | ------------------------------------------------ |
| uuids      | StringArray        |       是       | iBeacon设备广播的 uuids                           |
| success  | function      |  否       | 接口调用成功的回调函数                           |
| fail     | function      |         否       | 接口调用失败的回调函数                           |
| complete | function      |        否       | 接口调用结束的回调函数（调用成功、失败都会执行） |

示例代码：

```javascript

React.api.startBeaconDiscovery({
  uuids:['uuid1','uuid2'],
  success: (res) => {
    console.log(res)
  },
  fail:(res) => {
  },
  complete: (res)=>{
  }
});
```

>  uuid1、uuid2 为目标 iBeacon 的UUID，可从硬件厂商获取，如果为空，无法搜索到 iBeacon

## stopBeaconDiscovery(OBJECT)

停止搜索附近的iBeacon设备

**参数**

Object object

| 参数名     | 类型          |是否必须 | 说明                                             |
| -------- | ------------- | -------- | ------------------------------------------------ |
| success  | function      |  否       | 接口调用成功的回调函数                           |
| fail     | function      |         否       | 接口调用失败的回调函数                           |
| complete | function      |        否       | 接口调用结束的回调函数（调用成功、失败都会执行） |


## getBeacons(OBJECT)

获取所有已搜索到的iBeacon设备

**参数**

Object object

| 参数名     | 类型          |是否必须 | 说明                                             |
| -------- | ------------- | -------- | ------------------------------------------------ |
| success  | function      |  否       | 接口调用成功的回调函数                           |
| fail     | function      |         否       | 接口调用失败的回调函数                           |
| complete | function      |        否       | 接口调用结束的回调函数（调用成功、失败都会执行） |

**success返回参数说明**

| 参数名          | 类型        | 描述                                       | 支持平台 |
| ------------- | ----------- | ------------------------------------------ | -------- |
| beacons | ObjectArray | iBeacon 设备列表                    | 都支持   |
| errMsg     | String | 调用结果 | 微信     |
| errCode     | String | errorCode=0 ,接口调用成功 | 支付宝     |


## onBeaconUpdate(CALLBACK)

监听 iBeacon 设备的更新事件

**CALLBACK返回参数说明：**

| 参数名          | 类型        | 描述                                       | 支持平台 |
| ------------- | ----------- | ------------------------------------------ | -------- |
| beacons | ObjectArray | iBeacon 设备列表                    | 都支持   |

**iBeacon 结构：**

| 参数名          | 类型        | 描述                                       | 
| ------------- | ----------- | ------------------------------------------ | 
| uuid | String | iBeacon 设备广播的 uuid                    | 
| major | String | iBeacon 设备的主 id                    | 
| minor | String | iBeacon 设备的次 id                   | 
| proximity | Number | 表示设备距离的枚举值(0-3分别代表：未知、极近、近、远)                   | 
| accuracy | Number | iBeacon 设备的距离                    | 
| rssi | Number | iBeacon 信号强度                   | 

## onBeaconServiceChange(CALLBACK)

监听 iBeacon 服务的状态变化

**CALLBACK返回参数说明：**

| 参数名          | 类型        | 描述                                       | 
| ------------- | ----------- | ------------------------------------------ | 
| available | Boolean | 服务目前是否可用                    | 
| discovering | Boolean | 目前是否处于搜索状态                    | 