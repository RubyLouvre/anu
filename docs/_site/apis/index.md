# API

## 概述

![](./api.png)

| API                            | 类型          | 说明                                                                   |
|--------------------------------|-------------|----------------------------------------------------------------------|
| React.createElement            | 内部 API      | 创建元素, 由于只允许你使用JSX，因此无法使用     
| React.cloneElement             | 内部 API      | 复制元素, 由于只允许你使用JSX，因此无法使用        
| React.createFactory            | 内部 API      | 包装组件, 由于只允许你使用JSX，因此无法使用                                   |
| React.createRef                | &nbsp;      | 不存在                                                                  |
| React.forwardRef               | &nbsp;      | 不存在                                                                  |
| React.api                      | &nbsp;      | 相当于微信的 wx, 支付宝小程序的 my，百度小程的 swan, 字节跳动的tt, QQ小程序的qq, 为了方便编译，请不要在业务代码中直接用 wx,要用 React.api |
| React.getApp                   | &nbsp;      | 相当于微信的 getApp                                                        |
| React.Component                | &nbsp;      | 所有组件的基类                                                              |
| React.useComponent | 内部 API      | 用来创建组件                                                               |
| React.getCurrentPage |       | 得到当前页面的react实例， instance.props.query, instance.props.path为当前路径与参数对象                                                             |
| React.toClass                  | 内部 API      | 用来转译 es6 类                                                           |
| React.toStyle                  | 内部 API      | 用来转译样式                                                               |
| React.registerPage      | 内部 API      | 页面组件会自动在底部添加这方法                                                      |
| React.registerComponent      | 内部 API      | 通用组件会自动在底部添加这方法                                                      |
| onShow                         | 页面组件的生命周期钩子 |                                                         |
| onHide                         | 页面组件的生命周期钩子 |                                                          |
| onPageScroll                   | 页面组件的事件     | 监听用户滑动页面事件                                                           |
| onShareAppMessage/onShare              | 页面组件的事件     | 用于返回分享的内容,建议改用onShare                                                        |
| onReachBottom                  | 页面组件的事件     | 监听用户上拉触底事件                                                           |
| onPullDownRefresh              | 页面组件的事件     | 监听用户下拉刷新事件                                                           |
| componentWillMount             | 组件的生命周期钩子   | 相当于小程序的onLoad <br> props 中有 path, query 等路由相关信息                      |
| componentWillUpdate            | 组件的生命周期钩子   | 没有对应的小程序生命周期钩子                                                            |
| componentDidMount              | 组件的生命周期钩子   | 相当于小程序的onReady                                                       |
| componentDidUpdate             | 组件的生命周期钩子   | 没有对应的小程序生命周期钩子                                                          |
| componentWillUnmount           | 组件的生命周期钩子   | 相当于小程序的onUnload                                                      |
| componentWillRecieveProps      | 组件的生命周期钩子   |                                                                      |
| shouldComponentUpdate          | 组件的生命周期钩子   |                                                                      |
| componentDidCatch              | 组件的生命周期钩子   |                                                                      |
| getChildContext                | 组件的方法       |                                                                      |
| setState                       | 组件的方法       | 更新页面                                                                 |
| forceUpdate                    | 组件的方法       | 更新页面                                                                 |
| refs                           | 组件实例上的对象    | 里面保存着子组件的实例（由于没有 DOM，对于普通标签来说， <br />虽然也能保存着它的虚拟 DOM )               |
| render                         | 组件的方法       | 里面必须使用 JSX ，其他方法不能存在 JSX，不能显式使用 createElement                        |
