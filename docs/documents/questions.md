# 常见问题

- 暂时不支持 redux,请使用 `React.getApp().globalData` 来在页面间交换数据
- render 里面不能定义变量,即不能出现 `var`, `const`, `let` 语句。`render()` 里只能使用 JSX 来描述结构，不能使用 `React.createElement()`。
- 组件必须定义在 `components` 中
- 为什么底部不出现 TabBar？ 这是小程序自身的 BUG，详见[这里](https://www.cnblogs.com/bellagao/p/6291880.html)
- 路由跳转时，如何拿到当前路径与参数，原来是通过 `onLoad` 方法拿，现在你可以通过任何一个页面组件的生命周期钩子，访问 `this.props`，里面就有 `path` 与 `query` 属性
- 静态资源统一放到 `src` 目录下的 `assets` 目录下
- `wxml` 模板部分，如果使用了箭头函数，那么它里面不能出现 `this` 关键字
- 不要在 `props`, `state`, `context` 里面放 JSX，因为 JSX 的结构容易出现环引用，导到微信小程序内部的 JSON.stringify 出错
- input组件 统一使用onChange事件，因为有的平台支持onInput, 有的平台支持onChange, 转译器会翻译相应支持的事件
- 业务有涉及拿globalData.systemInfo里面高度的，改为React.api.getSystemInfoSync()。第一次进入页面有底bar的话 高度会拿错，导致业务液面高度计算错误，下面空一块。
- `React.getCurrentPage()` 能得到当前页面的react实例， instance.props.query, instance.props.path为当前路径与参数对象
更多问题请到 GitHub 提 [Issue](https://github.com/roland-reed/nanachi-cli/issues)。


