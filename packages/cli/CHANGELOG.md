# Changelog


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
- Fix: 修复windows下npm模块路径处理bug。[#605](https://github.com/RubyLouvre/anu/issues/609)
- Fix: 修复 pdd 和 music 模板在快应用bug。
- Fix: 修复 jsx 模版的 map 回调函数第二个参数缺失会报错问题。
- Fix: 修复 setNavigationBarTitle 接口。
