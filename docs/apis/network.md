# 网络

## request

支付宝： 向指定服务器发起一个跨域 http 请求， 微信： 发起 HTTPS 网络请求

**参数**
Object object

| 属性         | 类型     | 默认值 | 是否必须 | 说明                                                                                                                                        | 支持平台 |
| ------------ | -------- | ------ | -------- | ------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| url          | string   |        | 是       | 开发者服务器接口地址                                                                                                                        | 都支持   |
| header       | Object   |        | 否       | 设置请求的 header，header 中不能设置 Referer。 微信默认值： content-type 默认为 application/json 支付宝是 application/x-www-form-urlencoded | 都支持   |
| method       | String   | GET    | 否       | HTTP 请求方法                                                                                                                               | 都支持   |
| data         | Object   |        | 否       | 请求的参数                                                                                                                                  | 都支持   |
| dataType     | String   | json   | 否       | 返回的数据格式                                                                                                                              | 都支持   |
| responseType | String   | text   | 否       | 响应的数据类型                                                                                                                              | 微信     |
| timeout      | Number   | 30000  | 否       | 超时时间                                                                                                                                    | 支付宝   |
| success      | function |        | 否       | 接口调用成功的回调函数                                                                                                                      |
| fail         | function |        | 否       | 接口调用失败的回调函数                                                                                                                      |
| complete     | function |        | 否       | 接口调用结束的回调函数（调用成功、失败都会执行）                                                                                            |

**object.success 回调函数**

Object res

| 属性       | 类型   | 描述                                       |
| ---------- | ------ | ------------------------------------------ |
| data       | string | 响应数据，格式取决于请求时的 dataType 参数 |
| statusCode | Number | 开发者服务器返回的 HTTP 状态码             |
| header     | Object | 开发者服务器返回的 HTTP Response Header    |

## uploadFile(Object object)

将本地资源上传到开发者服务器

**参数**
Object object

| 属性     | 类型     | 默认值 | 是否必须 | 说明                                                                | 支持平台 |
| -------- | -------- | ------ | -------- | ------------------------------------------------------------------- | -------- |
| url      | string   |        | 是       | 开发者服务器接口地址                                                | 都支持   |
| filePath | String   |        | 是       | 要上传文件资源的路径                                                | 都支持   |
| name     | String   |        | 是       | 文件对应的 key，开发者在服务端可以通过这个 key 获取文件的二进制内容 | 都支持   |
| header   | Object   |        | 否       | HTTP 请求 Header，Header 中不能设置 Referer                         | 都支持   |
| formData | Object   |        | 否       | HTTP 请求中其他额外的 form data                                     | 都支持   |
| fileType | String   |        | 是       | 文件类型，image / video / audio                                     | 支付宝   |
| success  | function |        | 否       | 接口调用成功的回调函数                                              |
| fail     | function |        | 否       | 接口调用失败的回调函数                                              |
| complete | function |        | 否       | 接口调用结束的回调函数（调用成功、失败都会执行）                    |
| getRawResult | function  |   | 否       | 用于获取原始的uploadTask对象，上面可以添加进度回调 |

**object.success 回调函数**

Object res

| 属性       | 类型   | 描述                                       |
| ---------- | ------ | ------------------------------------------ |
| data       | string | 响应数据，格式取决于请求时的 dataType 参数 |
| statusCode | Number | 开发者服务器返回的 HTTP 状态码             |

## downloadFile(Object object)

下载文件资源到本地

> 注意：请在服务端响应的 header 中指定合理的 Content-Type 字段，以保证客户端正确处理文件类型。

**参数**
Object object

| 属性     | 类型     | 默认值 | 是否必须 | 说明                                             | 支持平台 |
| -------- | -------- | ------ | -------- | ------------------------------------------------ | -------- |
| url      | string   |        | 是       | 下载资源的 url                                   | 都支持   |
| header   | Object   |        | 否       | HTTP 请求的 Header，Header 中不能设置 Referer    | 都支持   |
| filePath | String   |        | 否       | 指定文件下载后存储的路径                         | 微信     |
| success  | function |        | 否       | 接口调用成功的回调函数                           |
| fail     | function |        | 否       | 接口调用失败的回调函数                           |
| complete | function |        | 否       | 接口调用结束的回调函数（调用成功、失败都会执行） |
| getRawResult | function  |   | 否       | 用于获取原始的uploadTask对象，上面可以添加进度回调 |

**object.success 回调函数**

Object res

| 属性         | 类型   | 描述                                                                                   |
| ------------ | ------ | -------------------------------------------------------------------------------------- |
| tempFilePath | string | 临时文件路径。如果没传入 filePath 指定文件存储路径，则下载后的文件会存储到一个临时文件 |
| statusCode   | Number | 开发者服务器返回的 HTTP 状态码                                                         |

## connectSocket(Object object)

创建一个 WebSocket 的连接；一个支付宝小程序同时只能保留一个 WebSocket 连接，如果当前已存在 WebSocket 连接，会自动关闭该连接，并重新创建一个新的 WebSocket 连接。（微信： 1.7.0 及以上版本，最多可以同时存在 5（小游戏）/2（小程序）个 WebSocket 连接。百度：1.9.4以上支持多个WebSockcet连接）

**参数**
Object object

| 属性      | 类型          | 默认值 | 是否必须 | 说明                                             | 支持平台 |
| --------- | ------------- | ------ | -------- | ------------------------------------------------ | -------- |
| url       | string        |        | 是       | 开发者服务器接口地址，必须是 wss 协议，且域名必须是后台配置的合法域名。                                   | 都支持   |
| header    | Object        |        | 否       | HTTP 请求的 Header，Header 中不能设置 Referer    | 都支持   |
| protocols | Array. string |        | 否       | 子协议数组                                       | 微信     |
| success   | function      |        | 否       | 接口调用成功的回调函数                           | 都支持   |
| fail      | function      |        | 否       | 接口调用失败的回调函数                           | 都支持   |
| complete  | function      |        | 否       | 接口调用结束的回调函数（调用成功、失败都会执行） | 都支持   |

## onSocketOpen(function callback)

监听 WebSocket 连接打开事件

**参数**

function callback
WebSocket 连接打开事件的回调函数

```javascript
React.api.connectSocket({
  url: 'test.php'
});

React.api.onSocketOpen(function(res) {
  console.log('WebSocket 连接已打开！');
});
```

## closeSocket(Object object)

关闭 WeSocket 连接

**参数**
Object object

| 属性      | 类型          | 默认值 | 是否必须 | 说明                                             | 支持平台 |
| --------- | ------------- | ------ | -------- | ------------------------------------------------ | -------- |
| code       | number        |   1000（表示正常关闭连接）     | 否       | 一个数字值表示关闭连接的状态号，表示连接被关闭的原因。	|微信   |
| reason    | string        |        | 否       | 一个可读的字符串，表示连接被关闭的原因。这个字符串必须是不长于 123 字节的 UTF-8 文本（不是字符）。    |微信   |
| success   | function      |        | 否       | 接口调用成功的回调函数                           |
| fail      | function      |        | 否       | 接口调用失败的回调函数                           |
| complete  | function      |        | 否       | 接口调用结束的回调函数（调用成功、失败都会执行） |


## sendSocketMessage(Object object)

通过 WebSocket 连接发送数据，需要先 wx.connectSocket，并在 wx.onSocketOpen 回调之后才能发送

**参数**
Object object

| 属性      | 类型          | 默认值 | 是否必须 | 说明                                             | 支持平台 |
| --------- | ------------- | ------ | -------- | ------------------------------------------------ | -------- |
| data       | string/ArrayBuffer        |        | 是      | 需要发送的内容	|都支持   |
| isBuffer    | Boolean       |        | 否       | 如果需要发送二进制数据，需要将入参数据经 base64 编码成 String 后赋值 data，同时将此字段设置为true，否则如果是普通的文本内容 String，不需要设置此字段   |支付宝  |
| success   | function      |        | 否       | 接口调用成功的回调函数                           |
| fail      | function      |        | 否       | 接口调用失败的回调函数                           |
| complete  | function      |        | 否       | 接口调用结束的回调函数（调用成功、失败都会执行） |


## onSocketMessage(function callback)

监听WebSocket 接受到服务器的消息事件

**参数**

function callback
WebSocket 接受到服务器的消息事件的回调函数

**object.success 回调函数**

Object res

| 属性         | 类型   | 描述                                                                                   |
| ------------ | ------ | -------------------------------------------------------------------------------------- |
| data | string/ArrayBuffer | 服务器返回的消息 |



## onSocketError(function callback)

监听WebSocket 错误事件

**参数**

function callback
WebSocket 错误事件的回调函数

## onSocketClose(function callback)


监听WebSocket 连接关闭事件

**参数**

function callback
WebSocket 连接关闭事件的回调函数


