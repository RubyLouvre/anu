# Changelog


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
- 修复快应用下`manifest.json`配置拷贝不全的 bug。。



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