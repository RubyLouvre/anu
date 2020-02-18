
# TabBar

## switchTab(OBJECT)

跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面

**OBJECT 参数说明：**

| 参数     | 类型     | 是否必须 | 说明                                                                                                                                                        | 支持平台 |
| -------- | -------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| url      | string   | 是       | 需要跳转的 tabBar 页面的路径（需在 app.json 的 tabBar 字段定义的页面），路径后不能带参数 | 都支持   |
| success  | function | 否       | 接口调用成功的回调函数                                                                                                                                      | 都支持   |
| fail     | function | 否       | 接口调用失败的回调函数                                                                                                                                      | 都支持   |
| complete | function | 否       | 接口调用结束的回调函数（调用成功、失败都会执行）                                                                                                            | 都支持   |

代码示例

```
// app.json
{
  "tabBar": {
    "list": [{
      "pagePath": "index",
      "text": "首页"
    },{
      "pagePath": "other",
      "text": "其他"
    }]
  }
}
```

```javascript
React.api.switchTab({
  url: '/index'
})

```
