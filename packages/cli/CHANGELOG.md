# Changelog


# 1.3.8 (2019-10-08)

-  修复百度小程序在真机预览时，由于被压缩的缘故导致页面的React组件找不到对应的小程序组件，出现部分内容为空白。


# 1.3.7 (2019-09-29)

## 核心库

#### Bug fix

- 修复ReactQuick生命周期触发时机Bug。

## CLI
#### Feature

- 支持360小程序编译，参考文档：https://rubylouvre.github.io/nanachi/documents/install.html 
- 支持代码中引入快应用原生API，如: require('@system.app')。(需自行编写按需打包逻辑)
- 快应用默认manifest.json文件添加display.titleBarBackgroundColor = '#ffffff'字段。

# 1.3.6 (2019-09-23)

## 核心库
#### Feature

- 添加React.memo方法。
- 添加React.api.setBackgroundColor && React.api.setBackgroundTextStyle。
- 事件系统中添加事件名映射，参考文档中映射事件名部分：https://rubylouvre.github.io/nanachi/documents/event.html
- 添加ReactH5 剪切板api。
- 添加ReactQuick accountGetProvider、accountAuthorize api。

#### Bug fix

- 修复useImperativeHandle 钩子不触发bug。

## CLI
#### Feature

- 支持typescript，添加typescript模板。
- nanachi api新增prevJsLoaders, postJsLoaders, prevCssLoaders, postCssLoaders。

# 1.3.4 (2019-08-27)

## 核心库
#### Feature
- 百度小程序生命周期更化，延迟百度小程序组件的attach钩子
- 全平台支持Redux、Mobx。
- 针对百度小程序的生命周期更化延迟detach钩子的触发

#### Bug fix

- 修复useCallback useEffect useState bug。
- 修复快应用路由bug。
- 修复小程序三目运算中的组件渲染错乱bug。

## CLI
#### Feature

- H5添加scroll-view组件。
- 新增Redux、Mobx模板。
- CLI迁移至Typescript。

#### Bug fix

- 修复H5组件、api的一些bug。

# 1.3.3 (2019-07-11)

## 核心库
#### Feature

- 华为快应用添加两个静态对象，innerQuery、outterQuery分别获取页面间的传参和外部跳进来页面的传参。
- 简化了快应用分享。

## CLI
#### Feature

- chaika分包工具整合成nanachi webpack plugin。
- h5方案重构，去掉mobx层，支持自定义html模板，与其他平台解析逻辑统一。
- 支持快应用sign目录用户自定义。
- 增加限制规则：jsx内不能调用非map函数。

# 1.3.2 (2019-07-01)

## 核心库
#### Feature

- 调整分享钩子的逻辑，确保onGlobalShare钩子有机会触发。

#### Bug fix

- 处理onShow, onHIde使用了async/await后，对应的全局构子不执行的问题。

## CLI
#### Feature

- 华为background-image:url(xxx)自动添加引号处理，防止华为编译报错。
- 华为负一屏卡片配置支持。

# 1.3.1 (2019-06-24)

## 核心库
#### Feature

- 添加快应用对React.api.switchTab的支持。
- 快应用getStorage，出错时也回调success，返回一个空对象。

#### Bug fix

- 修正微信小程序的核心库 attached里面的闭包引发的错误问题。
- 防止多次对API进行Promise化。

## CLI
#### Feature

- 添加pages目录检查：page目录下（除common目录），所有目录最多包含一个js文件。（只在用到分包功能情况时检查）
- 增加快应用form, button标签submit相关事件忽略。
- 兼容支付宝标签属性bug（字符串问题），添加wxml补丁。

#### Bug fix
- 修复快应用配置不生效问题。

# 1.3.0 (2019-06-14)

## CLI
#### Feature

- 所有平台迁移至webpack4编译。
- app.js中引入的工具函数(common)或组件(components)目录不会配置到app.json文件中

#### Bug fix
- 修复linux平台路径找不到bug。

# 1.2.8 (2019-06-06)
## 核心库
#### Feature

- 快应用支持与小程序一样的getCurrentPages, navigatorBack 方法。
- 支持微信小程序插件
- 空心化核心库的insertElement, removeElement, emptyElement方法，换言之，它们只是空方法，里面没有代码。因为我们也不需生成假的DOM节点，这些少生成许多对象，性能大大提升。

#### Bug fix

- 事件里可以条件绑定函数。

## CLI
#### Feature

- 微信小程序，QQ小程序不会在循环中添加wx:key="*this"
- 模板项目添加分包与分包预加载的演示
- 微信小程序、QQ小程序编译改用全新的nanachi-webpack，那是基于webpack4的CLI，性能是原来2倍的。
- huawei合并manifest问题
- pages目录下面请允许添加每个频道自己的components, assets, common目录，有利于分包。如果不这样做，每个频道的组件都放到主包中，导致体积超出限制。
- 更新disabledTitleBarPages的逻辑(快应用)

#### Bug fix
- windows快应用产物后缀名bug。 #984

# 1.2.7 (2019-05-28)
## CLI
#### Bug fix
- 修复`-`路径名bug
- 支持支付宝分包

# 1.2.6 (2019-05-27)
## CLI
#### Bug fix
- 修复快应用补丁组件引用问题
- 修复静态资源别名解析路径bug

# 1.2.5 (2019-05-24)

## 核心库
#### Feature
- 抹平小程序与快应用在页面组件的onTabItemTap差异。
- 组件支持静态的options对象， 以支持微信小程序的自定义组件的options.styleIsolation功能。 https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/wxml-wxss.html

#### Bug fix
- 修正onShare在页面只触发一次的BUG https://github.com/RubyLouvre/anu/issues/1000

## CLI
#### Feature
- 请允许components出现在pages下面，以实现更好的分包功能。https://rubylouvre.github.io/nanachi/documents/subpackages.html
- 重构qunar样板工程，以演示分包功能。


# 1.2.4 (2019-05-17)

## 核心库
#### Feature
- 添加React Hooks的支持，添加箭头函数的支持。
- ReactWX添加结useState, useContext, useEffect的支持，并去掉Children, createPortal, cloneElement, isValidElement。
- 抹平微信和qq小程序中getStorage api差异。

#### Bug fix
- 事件里可以条件绑定函数。

## CLI
#### Feature
- regenerator-runtime锁定版本号。
- 支持快应用自定义合并router。

#### Bug fix
- windows快应用产物后缀名bug。 [#984](https://github.com/RubyLouvre/anu/issues/984)

# 1.2.2 (2019-04-26)

## CLI
#### Feature
- 对 app.js 中 是否有 globalData 对象做强制校验。
- 支持 QQ 小程序分包。

#### Bug fix
- 兼容快应用中 css 动画规则 keyframes。
- 修复快应用下 showToast bug。
- 修复静态资源 copy 路径 bug。



# 1.2.1 (2019-04-19)

## 核心库
#### Feature
- 增加快应用 push API。


## CLI
#### Feature
- 强制校验组件所在目录名，引用组件名的规范。


#### Bug fix
- 修复快应用 tabBar 点击无 active 状态 bug。
- 修复微信小程序 Request 请求两次 bug。




# 1.2.0 (2019-04-12)

## 核心库

#### Bug fix
- 修复支付宝小程的 React.api.request 中 header 头 bug。


## CLI
#### Feature
- 支持 QQ 轻应用。
- 优化快应用智能化 webview 逻辑，更加灵活。
- 将实例 config 变成静态 config 以提高性能。
- 更新快应用获取参数机制



#### Bug fix
- 修复微信, QQ小程序遍历节点上 key 属性的 bug。
- 修复华为快应用无法获取页面参数 bug。
- 修复华为快应用行内样式处理 bug。
- 修复华为快应用 PageWrapper 组件模版 bug。
- 修复样式 @import bug。
- 修复 React 组件类中 config 属性逻辑处理 bug。





# 1.1.8 (2019-03-25)

## 核心库
#### Bug fix
- 让`ctor.displayName`能代替`fiber.name`。


## CLI
#### Bug fix
- 修复快应用下`assets`目录copy路径出错 bug。



# 1.1.7 (2019-03-22)

## 核心库
#### Bug fix
- 修复快应用与React实例匹对的bug, 如果一个页面的组件被销毁`(get(reactInstance).disposed === true)`, 那么它将不会被小程序重复利用。


## CLI  

#### Feature
- 优化CLI构建速度、流畅性。

#### Bug fix
- 修复CLI构建结束回调 bug。
- 修复自定义 `tabBar` 构建后有冗余配置 bug。
- 修复快应用下`manifest.json`配置拷贝不全的 bug。



# 1.1.6 (2019-03-15)

## 核心库
#### Bug fix
- 修复华为快应用事件系统 bug。


## CLI  

#### Feature
- 支持不同平台自定义 `tabBar`。
- 支持快应用平台自定义项目配置，详见[文档](https://rubylouvre.github.io/nanachi/documents/userProjectConfig.html#%E5%BF%AB%E5%BA%94%E7%94%A8)。

#### Bug fix
- 过滤快应用不支持的样式编译，避免华为快应用平台报错。


# 1.1.5 (2019-03-08)

## 核心库

#### Feature
- 增加快应用的打电话API: `makePhoneCall`。
- 重写 `setNavigationBarTitle`, `stopPullDownRefresh`, `createAnimation`。

#### Bug fix
- 修正所有小程序与快应用的 request 实现， 非微信系的 request 不做并发处理，只做 Promsie 处理。


## CLI  

#### Feature
- 升级到 babel7。
- 支持快应用下自定义项目配置。
- 支持 span 标签下三元运算表达式。


#### Bug fix
- 修复转换快应用 px 转换 bug。
- 修复转换快应用下 getDeviceId 接口 bug。
- 修复初始化模板 bug。
- 修复 windows 平台 js 模块引用 bug。



# 1.1.4 (2019-03-01)

## 核心库

#### Feature
- Promise 化快应用API。
- 支持快应用支付接口。

#### Bug fix
- 修复构建快应用下一些 API bug。
- 容错平台没有实现的API，执行一个空函数。


## CLI  

#### Feature
- 升级快应用下行内元素转换规则。
- 支持命令行 `--beta-ui` 参数, 加载远程最新版补丁组件。


#### Bug fix
- 修复快应用下 `px` 转换 bug。



# 1.1.3 (2019-02-27)

## 核心库
#### Feature
- 提前快应用组件注入数据的时机，从 `onReady` 改成 `onInit` 。


## CLI  

#### Feature
- 支持快应用自定义 `titleBar` 的现实/隐藏。
- 升级快应用的标签与事件名转换。
- 简化编译快应用时构建依赖安装流程 && 减少构建依赖安装。
- 升级快应用下 `scroll-view` 编译方式。


#### Bug fix
- 修复快应用下 `getSystemInfo` bug。

# 1.1.2 (2019-02-22)

## 核心库

#### Feature
- 简化各平台 getApp 实现。
- 支持快应用同步 storage API。


## CLI  

#### Feature
- 样式预处理器 dart-sass 替代 node-sass。
- 支持快应用智能 webview。
- 支持H5 pull refresh, scroll hooks 功能。
- 优化快应用下 block 标签生成机制（如果 
在span, text, strong 这几个标签内部出现 {} , {}里面有 三元或&&， 不应该转换成block）。


#### Bug fix
- 修复 windows 平台下路径处理 bug。
- 修复 H5 路由 bug。
- 修复快应用自动插入span 或 text 的功能。
- 修复快应用下页面配置对象没有定义 tabBar 就不应该走app.js的config的tabBar问题。


# 1.1.1 (2019-02-01)

## CLI  

#### Bug fix
- 修复样式 font-size/line-height、 background-position/background-size 缩写解析错误。
- 修复快应用中页面无法import pages目录中的js模块问题。
- 修复脚手架中 qunar 模板样式问题。
  

# 1.1.0 (2019-01-25)
## 核心库

#### Bug fix
- 修复小程序实例匹配错误 bug。

## CLI
#### Feature
- 增加百度 setMetaDescription, setMetaKeywords, setDocumentTitle 三个接口。
- 增加 nanachi page `<page-name>` 和 nanachi component `<component-name>` 两命令行接口。
  

#### Bug fix
- 修复 alias 别名 bug。
- 修复快应用样式样式解析 bug。
- 修复 qunar 模板样式 bug。




# 1.0.9 (2019-01-18)
## CLI
#### Feature
- 修复 qunar 模板样式问题。

# 1.0.8 (2019-01-18)
## CLI
#### Feature
- 修复命令行 --beta 参数。


# 1.0.7 (2019-01-18)
## 核心库

#### Bug fix
- 修复了对 Ref 的支持。
- 修复了 A 组件包括 B 组件，一个页面出现两个 A 组件时， 它们的 B 组件数据会串的问题。

## CLI
#### Feature
- 增加编译 H5 的功能。
- 重构脚手架命令层。

#### Bug fix
- 修复全量构建成功回调 log 错乱的 bug。




# 1.0.7-beta.0 (2019-01-16)
#### Bug fix
- 更新 postcss-less-engine-latest 插件版本。




# 1.0.6 (2019-01-11)
## 核心库

#### Bug fix
- 修复百度小程序数据错乱bug。


## CLI
#### Feature
- 增加各平台的补丁组件。
- 增加postcss解析less。




# 1.0.5 (2019-01-04)
## 核心库
#### Feature
- 统一小程序 render.all 的实现。

#### Bug fix
- 修复百度小程序组件错乱bug。


## CLI
#### Feature
- 增加 js 函数调用校验。
- build 前删除 dist 目录。





# 1.0.4 (2018-12-28)

## 核心库
#### Feature
- 重构createContext的实现了，少了大概40行代码量。
- 兼容快应用API: createCanvasContext, stopPullDownRefresh, storageSync。

#### Bug fix
- Fix: 修复小程序在页面切换时触发onUnload事件时抛错的BUG。 [#609](https://github.com/RubyLouvre/anu/issues/609)


## CLI
#### Feature
- 增加 jsx 模板编译测试。
- 增加 navigate*,  canvas , stopPullDownRefresh 测试。

#### Bug fix
- Fix: 修复快应用下async/await语法。
- Fix: 修复windows下npm模块路径处理bug。[#605](https://github.com/RubyLouvre/anu/issues/605)
- Fix: 修复 pdd 和 music 模板在快应用bug。
- Fix: 修复 jsx 模版的 map 回调函数第二个参数缺失会报错问题。
- Fix: 修复 setNavigationBarTitle 接口。
