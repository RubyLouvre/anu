# roadmap

> 以React方式开发小程序


使用： https://github.com/RubyLouvre/anu/tree/master/packages/render/miniapp

## 近期目标

1. postcss支持
2. 加快构建速度（监听文件变化后，不用再根据app.js抓取依赖，直接进行相应类型的parser）
3. 对map循环中的if分支进行优化，既然已经在JSX进行了过滤，我们只生成`<block wx:for>`
不再生成`<block wx:if>`
4. 将循环元素的key抽取出来，放到`<block wx:for>`中
6. 将render props函数进行抽取，改成一个独立的template
7. 添加一个redux的例子
8. 添加复杂的react例子
9. 添加一个配置文件，罗列已经有微信小程序的自定义组件机制实现的组件名单，那么我们在编译时不用将它转换成
`<React.template>` (即支持已经开发了一半的项目使用anu小程序) (已完成)
10. 在配置文件，指定对特定目录与文件忽略编译
11. 自定义eslint规则
12. 对JSX编译优化，ReactWX.default.createElement改成h,需要对上下文的变量进行保存，
确切知道React当前的名字及用户在render有没有定义了h变量（防止命名冲突，冲突改其他单字符）
13. 支持分包加载， 我们将app.js中的pages抽取出来，做成主包的加载JS，放到app.json中，用户自己写分包内容
14. 支持公司内部的ABTest与日志收集
15. 支持ReactWX/miniComponents别名


## 中期目标

支持typescript开发
支持H5 touch端生成（需要一个专门的render, 路由器及对weU改造）


## 远期目标

支持快应用的编译