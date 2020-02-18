# 内置UI库: Schnee UI

不是所有小程序都照着微信的那一套抄的，并且微信小程序的个别组件是基于native，他们（支付宝，百度等）拿不到源码，因此实现有所差异或延迟，并且为了以后让娜娜奇也运行于H5端，我们也需要实现那些不是H5标签的组件，因此就 Schnee UI

 [Schnee UI](https://qunarcorp.github.io/schnee-ui/index.html)包含了微信weui所有组件，不同之外是它是基于flexbox布局。用户可以自主引用，或在框架编译用户代码时，发现当前的目标编译平台（如快应用），不支持某种标签，就自动用
 Schnee UI的组件偷偷替换它。如快应用下的`<icon></icon>`，nanachi会自动转换成`<XIcon></XIcon>`, 并且自动引入XIcom组件的依赖。

外部组件:
 [https://qunarcorp.github.io/schnee-ui/index.html](https://qunarcorp.github.io/schnee-ui/index.html)


## 快应用 Demo（需要先扫码下载，然后在[快应用调试器](https://doc.quickapp.cn/tools/debugging-tools.html)里选择本地安装打开）

![](logo/schnee_ui_logo.png)