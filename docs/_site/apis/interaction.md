# 交互

## showModal(Object object)

显示模态对话框

**参数**

Object object

| 属性         | 类型     | 默认值  | 是否必须 | 说明                                               | 支持平台 |
| ------------ | -------- | ------- | -------- | -------------------------------------------------- | -------- |
| title        | string   |         | 是       | 提示的标题                                         | 都支持   |
| content      | string   |         | 是       | 提示的内容                                         | 都支持   |
| showCancel   | boolean  | true    | 否       | 是否  显示取消按钮                                 | 微信,百度,快应用     |
| cancelText   | string   | '取消'  | 否       | 取消  按钮的文字，最多 4 个  字符                  | 都支持   |
| cancelColor  | string   | #000000 | 否       | 取消按钮的文字颜色，必须是 16 进制格式的颜色字符串 | 微信, 快应用    |
| confirmText  | string   | '确定'  | 否       | 确定  按钮的文字，最多 4 个  字符                  | 都支持   |
| confirmColor | string   | #3cc51f，百度为#3c76ff | 否       | 确认按钮的文字颜色，必须是 16 进制格式的颜色字符串 | 微信，百度, 块应用     |
| success      | function |         | 否       | 接口调用成功的回调函数                             | 都支持   |
| fail         | function |         | 否       | 接口调用失败的回调函数                             | 都支持   |
| complete     | function |         | 否       | 接口调用结束的回调函数（调用成功、失败都会执行）   | 都支持   |

object.success 回调函数

参数

Object res

| 属性    | 类型    | 说明                               | 支持平台 |
| ------- | ------- | ---------------------------------- | -------- |
| confirm | booleam | 为 true 时，表示用户点击了确定按钮 | 都支持   |

代码示例

```javascript
React.api.showModal({
  title: '温馨提示',
  content: '您是否想查询快递单号:1234567890',
  confirmText: '马上查询',
  cancelText: '暂不需要',
  success: result => {
    console.log('result', result);
  }
});
```

## showToast(Object object)

显示一个弱提示，可选择多少秒之后消失

**参数**

Object object

| 属性     | 类型     | 默认值                      | 是否必须 | 说明                                             | 支持平台 |
| -------- | -------- | --------------------------- | -------- | ------------------------------------------------ | -------- |
| title    | string   |                             | 是       | 提示的内容                                       | 都支持   |
| icon     | string   | 微信，百度：success，支付：none   | 否       | 图标                                             | 都支持   |
| image    | string   |                             | 否       | 自定义图标的本地路径，image 的优先级高于 icon    | 微信，百度     |
| duration | number   | 微信： 1500， 支付宝，百度： 2000 | 否       | 提示的延迟时间                                   | 都支持   |
| mask     | boolean  | false                       | 否       | 是否显示透明蒙层，防止触摸穿透                   | 微信，百度     |
| success  | function |                             | 否       | 接口调用成功的回调函数                           | 都支持   |
| fail     | function |                             | 否       | 接口调用失败的回调函数                           | 都支持   |
| complete | function |                             | 否       | 接口调用结束的回调函数（调用成功、失败都会执行） | 都支持   |

代码示例

```javascript
React.api.showToast({
  icon: 'success',
  title: '操作成功',
  duration: 3000,
  success: () => {}
});
```

## hideToast()

## showLoading(Object object)

显示 loading 提示框, 需主动调用 wx.hideLoading 才能关闭提示框

**参数**

Object object

| 属性     | 类型     | 默认值 | 是否必须 | 说明                                             | 支持平台 |
| -------- | -------- | ------ | -------- | ------------------------------------------------ | -------- |
| title    | string   |        | 是       | 提示的内容                                       | 都支持   |
| mask     | boolean  | false  | 否       | 是否显示透明蒙层，防止触摸穿透                   | 微信，百度     |
| success  | function |        | 否       | 接口调用成功的回调函数                           | 都支持   |
| fail     | function |        | 否       | 接口调用失败的回调函数                           | 都支持   |
| complete | function |        | 否       | 接口调用结束的回调函数（调用成功、失败都会执行） | 都支持   |

代码示例

```javascript
React.api.showLoading({
  title: '加载中...'
});
```

## hideLoading()

## showActionSheet(Object object)

**参数**

Object object

| 属性     | 类型         | 默认值  | 是否必须 | 说明                                             | 支持平台 |
| -------- | ------------ | ------- | -------- | ------------------------------------------------ | -------- |
| itemList | Array string |         | 是       | 按钮的文字数组，数组长度最大为 6                 | 都支持   |
| itemColo | string       | #000000，百度为#3c76ff | 否       | 按钮的文字颜色                                   | 微信，百度     |
| success  | function     |         | 否       | 接口调用成功的回调函数                           | 都支持   |
| fail     | function     |         | 否       | 接口调用失败的回调函数                           | 都支持   |
| complete | function     |         | 否       | 接口调用结束的回调函数（调用成功、失败都会执行） | 都支持   |

代码示例

```javascript
React.api.showActionSheet({
  title: '支付宝-ActionSheet',
  itemList: ['菜单一', '菜单二', '菜单三', '菜单四', '菜单五'],
  success: res => {
    const btn = res.index === -1 ? '取消' : '第' + res.index + '个';
  }
});
```