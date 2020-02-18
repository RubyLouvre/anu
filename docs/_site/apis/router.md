# 路由跳转

> 在小程序中，我们建议使用React.api.navigateTo/redirectTo 来代替`<a>`标签

## navigateTo(OBJECT)

保留当前页面，跳转到应用内的某个页面，使用 wx.navigateBack 可以返回到原页面。

**OBJECT 参数说明：**

| 参数     | 类型     | 是否必须 | 说明                                                                                                                                                        | 支持平台 |
| -------- | --------  | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| url      | string   | 是       | 需要跳转的应用内非 tabBar 的页面的路径 , 路径后可以带参数。参数与路径之间使用?分隔，参数键与参数值用=相连，不同参数用&分隔；如 'path?key=value&key2=value2' | 都支持   |
| success  | function | 否       | 接口调用成功的回调函数                                                                                                                                      | 都支持   |
| fail     | function | 否       | 接口调用失败的回调函数                                                                                                                                      | 都支持   |
| complete | function | 否       | 接口调用结束的回调函数（调用成功、失败都会执行）                                                                                                            | 都支持   |

代码示例
```javascript
React.api.navigateTo({
    url: '/pages/xxx/index?key=value'
});
```

```javascript
//test.js
Page({
  componentDidMount: function(option) {
    console.log(option.query);
  }
});
```

> Tips: 目前页面路径最多只能十层，百度为5层。

## redirectTo(OBJECT)

关闭当前页面，跳转到应用内的某个页面。

**OBJECT 参数说明：**

| 参数     | 类型     | 是否必须 | 说明                                                                                                                                                        | 支持平台 |
| -------- | -------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| url      | string   | 是       | 需要跳转的应用内非 tabBar 的页面的路径 , 路径后可以带参数。参数与路径之间使用?分隔，参数键与参数值用=相连，不同参数用&分隔；如 'path?key=value&key2=value2' | 都支持   |
| success  | function | 否       | 接口调用成功的回调函数                                                                                                                                      | 都支持   |
| fail     | function | 否       | 接口调用失败的回调函数                                                                                                                                      | 都支持   |
| complete | function | 否       | 接口调用结束的回调函数（调用成功、失败都会执行）                                                                                                            | 都支持   |

代码示例

```javascript
React.api.redirectTo({
  url: 'pages/test/index?id=1'
});
```

## reLaunch(OBJECT)

关闭所有页面，打开到应用内的某个页面。

**OBJECT 参数说明：**

| 参数     | 类型     | 是否必须 | 说明                                                                                                                                                        | 支持平台 |
| -------- | -------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| url      | string   | 是       | 需要跳转的应用内非 tabBar 的页面的路径 , 路径后可以带参数。参数与路径之间使用?分隔，参数键与参数值用=相连，不同参数用&分隔；如 'path?key=value&key2=value2' | 都支持   |
| success  | function | 否       | 接口调用成功的回调函数                                                                                                                                      | 都支持   |
| fail     | function | 否       | 接口调用失败的回调函数                                                                                                                                      | 都支持   |
| complete | function | 否       | 接口调用结束的回调函数（调用成功、失败都会执行）                                                                                                            | 都支持   |

代码示例

```javascript
  React.api.reLaunch({
    url: 'pages/test/index?id=1'
  });
```

```javascript
//test.js
Page({
  componentDidMount: function(option) {
    console.log(option.query);
  }
});
```

## navigateBack(OBJECT)

关闭当前页面，返回上一页面或多级页面。可通过 getCurrentPages() 获取当前的页面栈，决定需要返回几层。

**OBJECT 参数说明：**

| 参数  | 类型   | 默认值 | 是否必须 | 说明                                                  | 支持平台 |
| ----- | ------ | ------ | -------- | ----------------------------------------------------- | -------- |
| delta | number | 1      | 是       | 返回的页面数，如果 delta 大于现有页面数，则返回到首页 | 都支持   |

代码示例

```javascript
// 注意：调用 navigateTo 跳转时，调用该方法的页面会被加入堆栈，而 redirectTo 方法则不会。见下方示例代码

// 此处是A页面
React.api.navigateTo({
  url:'pages/B/index?id=1'
});

// 此处是B页面
React.api.navigateTo({
  url: 'pages/C/index?id=1'
});

// 在C页面内 navigateBack，将返回A页面
React.api.navigateBack({
  delta: 2
});
```

> 微信小程序的switchTab存在兼容问题，不能用于快应用
