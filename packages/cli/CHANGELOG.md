# Changelog

# 1.0.8 (2019-01-18)
## CLI
#### Feature
- 修复命令行 --beta 参数


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