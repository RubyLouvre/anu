
# 滚动

## pageScrollTo(Object object)

将页面滚动到目标位置

**入参**

| 参数      | 类型   | 默认值|是否必须 |说明                |        支持平台               |
| --------- | ------ | ------|------------|------------|------------ |
| scrollTop | number | | 是 |滚动到页面的目标位置，单位 px |  都支持
| duration | number |300|否| 滚动动画的时长，单位 ms |  微信，百度
| success | Function | ||接口调用成功的回调函数 |  微信
| fail | Function | ||接口调用失败的回调函数 |  微信
| complete | Function ||| 接口调用结束的回调函数（调用成功、失败都会执行） |  微信