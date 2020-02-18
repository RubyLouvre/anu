# 设置导航条

## setNavigationBarTitle(OBJECT)

动态设置当前页面的标题

| 参数     | 类型      | 是否必须 | 说明                                                                                                                                                        | 支持平台 |
| -------- | -------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| title      | string   | 是       | 页面标题 | 都支持   |
| success  | function | 否       | 接口调用成功的回调函数                                                                                                                                      | 都支持   |
| fail     | function | 否       | 接口调用失败的回调函数                                                                                                                                      | 都支持   |
| complete | function | 否       | 接口调用结束的回调函数（调用成功、失败都会执行）                                                                                                            | 都支持   |




## setNavigationBarColor(OBJECT)

**OBJECT 参数说明：**

| 参数     | 类型      | 是否必须 | 说明                                                                                                                                                        | 支持平台 |
| -------- | -------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| backgroundColor      | string   | 是       | 背景颜色值，有效值为十六进制颜色 | 都支持   |
| frontColor  | string |        | 前景颜色值，包括按钮、标题、状态栏的颜色，仅支持 #ffffff 和 #000000                                                                                                                                      | 微信，百度   |
| borderBottomColor  | string | 否       | 导航栏底部边框颜色，支持十六进制颜色值。若设置了 backgroundColor，则borderBottomColor 不会生效，默认会和 backgroundColor 颜色一样                                                                                                                                      | 支付宝   |
| reset  | boolean | 否       | 是否重置导航栏为支付宝默认配色，默认 false                                                                                                                                      | 支付宝   |
| animation  | Object  | 否       | 动画效果                                                                                                                                     | 微信，百度   |
| animation.duration  | Number | 否       | 动画变化时间，默认0，单位：毫秒                                                                                                                                     | 微信，百度   |
| animation.timingFunc  | String | 否       | 动画变化方式，默认 linear                                                                                                                                     | 支付宝   |
| success  | function | 否       | 接口调用成功的回调函数                                                                                                                                      | 都支持   |
| fail     | function | 否       | 接口调用失败的回调函数                                                                                                                                      | 都支持   |
| complete | function | 否       | 接口调用结束的回调函数（调用成功、失败都会执行）                                                                                                            | 都支持   |


## showNavigationBarLoading()

在当前页面显示导航条加载动画。

## hideNavigationBarLoading()

隐藏导航条加载动画。