# 缓存

## setStorage(Object object)

将数据存储在本地缓存中指定的 key 中，会覆盖掉原来该 key 对应的内容。

**参数**

Object object

| 属性     | 类型          | 默认值 | 是否必须 | 说明                                             |
| -------- | ------------- | ------ | -------- | ------------------------------------------------ |
| key      | string        |        | 是       | 本地缓存中指定的 key                             |
| data     | Object/string |        | 是       | 需要存储的内容                                   |
| success  | function      |        | 否       | 接口调用成功的回调函数                           |
| fail     | function      |        | 否       | 接口调用失败的回调函数                           |
| complete | function      |        | 否       | 接口调用结束的回调函数（调用成功、失败都会执行） |

代码示例

```javascript
React.api.setStorage({
  key: 'key',
  data: 'value',
  success: function(res) {
    console.log('success', res)
  },
  fail: function(err) {
    console.log('fail', err)
  }
});
```

## setStorageSync(string key, Object|string data)

wx.setStorage 的同步版本

**参数**

Object object

| 属性 | 类型          | 默认值 | 是否必须 | 说明                 |
| ---- | ------------- | ------ | -------- | -------------------- |
| key  | string        |        | 是       | 本地缓存中指定的 key |
| data | Object/string |        | 是       | 需要存储的内容       |


代码示例

```javascript
React.api.setStorageSync('key','values');
```
## getStorage

获取缓存数据。

> 这是一个异步接口

**参数**

Object object

| 属性     | 类型     | 默认值 | 是否必须 | 说明                                             |
| -------- | -------- | ------ | -------- | ------------------------------------------------ |
| key      | string   |        | 是       | 本地缓存中指定的 key                             |
| success  | function |        | 否       | 接口调用成功的回调函数                           |
| fail     | function |        | 否       | 接口调用失败的回调函数                           |
| complete | function |        | 否       | 接口调用结束的回调函数（调用成功、失败都会执行） |


success返回参数说明：
| 参数     | 类型     | 说明                                             |
| -------- | -------- |  ------------------------------------------------ |
| data     | string   |key 对应的内容                             |

代码示例

```javascript
React.api.getStorage({
  key: 'key',
  success: function (res) {
    console.log(res.data);
  },
  fail: function (err) {
    console.log('错误码：' + err.errCode);
    console.log('错误信息：' + err.errMsg);
  }
});
```
## getStorageSync(string key)

同步获取缓存数据。

**参数**

String 

| 属性 | 类型   | 默认值 | 是否必须 | 说明                 |
| ---- | ------ | ------ | -------- | -------------------- |
| key  | string |        | 是       | 本地缓存中指定的 key |

代码示例：

```javascript
let res = React.api.getStorageSync('currentCity');
console.log('res', res);
```

快应用中使用 getStorageSync 

```javascript
// app.js 添加如下代码
 onGlobalLoad() {
        let ANU_ENV = process.env.ANU_ENV;//wx ali bu quick
        if(ANU_ENV === 'quick') {
            React.api.initStorageSync(this.globalData.__storage);
        }
        
    }
```

## removeStorage(Object object)

从本地缓存中移除指定 key

> 这是一个异步接口

**参数**

Object object

| 属性     | 类型     | 默认值 | 是否必须 | 说明                                             |
| -------- | -------- | ------ | -------- | ------------------------------------------------ |
| key      | string   |        | 是       | 本地缓存中指定的 key                             |
| success  | function |        | 否       | 接口调用成功的回调函数                           |
| fail     | function |        | 否       | 接口调用失败的回调函数                           |
| complete | function |        | 否       | 接口调用结束的回调函数（调用成功、失败都会执行） |

代码示例：

```javascript
React.api.removeStorage({
  key: 'currentCity',
  success: function() {
    console.log('删除成功' );
  }
});
```

## removeStorageSync(string key)


removeStorage 的同步版本。

**参数**

Object object

| 属性 | 类型   | 默认值 | 是否必须 | 说明                 |
| ---- | ------ | ------ | -------- | -------------------- |
| key  | string |        | 是       | 本地缓存中指定的 key |

代码示例：

```javascript
React.api.removeStorageSync({ key: 'currentCity' });
```

## clearStorage(Object object)

清理本地数据缓存

**参数**

Object object

| 属性     | 类型     | 默认值 | 是否必须 | 说明                                             |
| -------- | -------- | ------ | -------- | ------------------------------------------------ |
| success  | function |        | 否       | 接口调用成功的回调函数                           |
| fail     | function |        | 否       | 接口调用失败的回调函数                           |
| complete | function |        | 否       | 接口调用结束的回调函数（调用成功、失败都会执行） |

## clearStorageSync(Object object)

clearStorage 的同步版本


## getStorageInfo(Object object)

异步获取当前storage的相关信息

**参数**

Object object

| 属性     | 类型     | 默认值 | 是否必须 | 说明                                             |
| -------- | -------- | ------ | -------- | ------------------------------------------------ |
| success  | function |        | 否       | 接口调用成功的回调函数                           |
| fail     | function |        | 否       | 接口调用失败的回调函数                           |
| complete | function |        | 否       | 接口调用结束的回调函数（调用成功、失败都会执行） |

**object.success 回调函数**


| 属性     | 类型     | 说明                                             |
| -------- | -------- |------------------------------------------------ |
| keys  | Array. string |    当前 storage 中所有的 key                           |
| currentSize     | number |   当前占用的空间大小, 单位 KB                           |
| limitSize | number |    限制的空间大小，单位 KB |


## getStorageInfoSync(Object object)

getStorageInfo 的同步版本


**返回值**

Object object

| 属性     | 类型     | 说明                                             |
| -------- | -------- |------------------------------------------------ |
| keys  | Array. string |    当前 storage 中所有的 key                           |
| currentSize     | number |   当前占用的空间大小, 单位 KB                           |
| limitSize | number |    限制的空间大小，单位 KB |
