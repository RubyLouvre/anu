## 1.1.3
1. 抽象出一个Update类，用于封装组件实例上的所有私有数据
2. 抽象出一个instantiateComponente用于同时实例化有状态与无状态组件，从此再没有mountStateless, updateStateless方法
3. 修正checkbox点一下会触发两次onChange的BUG
4. 添加ReceiveComponent检测机制，如果context,props一样，那么就不会执行receive, render, update等钩子
5. 修改检测空对象的逻辑
6. 简化任务调度系统的逻辑

## 1.1.2
1. 修正 onChange 事件
2. 重构 diffProps 模块的实现
3. 支持组件的isMounted方法
4. 添加beforePatch , afterPatch钩子
5. 添加lib/ReactInputSelection.js
6.  统一所有操作虚拟DOM的方法的参数(mountXXX, updateXXX, alignXXX系列)

>1 第一个参数为旧真实DOM或旧虚拟DOM
>2 第二个参数为新虚拟DOM
>3 第三个参数为父虚拟DOM(可能不存在，那么后面直接跟第四，第五)
>4 第四个参数为上下文对象
>5 第五个参数为任务调度系系统的列队

7. 使用全新的方式获取元素的命名空间
8. 上线全新的节点排序算法(diffChildren)
9. renderByAnu在全局渲染后应该置空CurrentOwner.cur, 防止影响其他虚拟DOM
10. 完善createStringRef方法，应该能抛错与删除无用数据
11. 上线全新的任务调度系统
12. 重构unmountComponentAtNode方法
13. 添加对两个虚拟DOM的引用都相同的情况下，检测子组件的contextType决定是否更新的策略
14. 无状态组件支持模块模式（返回一个带生命周期钩子的纯对象，这些方法会像有状态组件那样被调用）
15. 放松shouldComponentUpdate的限制，返回任何假值都阻止子孙更新
16. 修正ref的更新方式
17. shouldComponentUpdate返回假值时，当前的虚拟DOM应该吸纳旧虚拟DOM的有用信息

## 1.1.1
1. 简化createClass
2. 修正flattenHooks BUG， 如果hooks中只有一个函数，就不用再包一层
3. 重构虚拟DOM树的实现，与官方React保持一致，即props.children现在是多种形态，延迟到diff时才创建用于比较的vchildren
4. 修正disposeElement，如果存在dangerouslySetInnerHTML的情况，需要清空元素内部，不走遍历子虚拟DOM的分支
5. 修正diffProps, SVG的元素是区分大小写 如viewBox preserveAspectRation
6. 组件更新时，要检测context是否改变
7. 为事件对象实现persist方法
8. 修正unstable_renderSubtreeIntoContainer的回调的this指向问题
9. 修正unmountComponentAtNode BUG， #text改为 #comment
10. 修正cloneElement BUG， 确保children与_owner正确传入
11. 修正ref机制，如果为字符串时，通过createStringRef方法将当前ref, owner传入，返回一个curry方法，在cloneElement时
    createStringRef创建的方法会再被整合到新ref方法的内部，确保旧的owner再次被更新
12. 修正getNs方法的实现（原先是使用hash表进行穷举，但svg文档也有a, script ,style元素，导致无法区分）
13. 用户在componentDidUpdate使用setState是不当操作，导致进入死循环，改用定时器减缓调用频率，防止页面卡死（官方React也存在类似的机制）
## 1.1.0
1. disabled的元素不能触发点击事件
2. 修正mouseenter/mouseleave在IE6－8中的BUG，涉及到relatedTarget的正确获取与LCA处理
3. 简化alignVnode的逻辑，减少插入列队的生成
4. 重构setStateImpl,
5. `_component`更名为`__component`, `_currentElement`更名为`__current`
6. react/lib中添加一些简用的外围模块，如ReactComponentWithPureRenderMixin，shallowCompare，sliceChildren


## 1.0.8
1. event.originalEvent更名为 event.nativeEvent
2. 修正polyfill中forEach的BUG
3. 移除scheduler模块
4. 移除instanceMap模块
5. 修正typeNumber在iE6－8下的BUG
6. `eventSystem.addGlobalEventListener`更名为eventSystem.addGlobalEvent
7. 规避insertBfore在IE8下第二参数不能为 undefined的问题
8. 修正ref延迟执行的BUG，组件所在的vnode如果有ref属性，那么它应该放到此组件的`__pendingRefs`数组中，而不是放在父组件的`__pendingRefs`数组
   此外`__pendingRefs`数组里的元素由对象改成函数
9.  确保组件在componentDidMount钩子执行setState后，所有回调应延迟到componentDidUpdate外执行
10. 确保mountComponent中实例应该尽快保存到vnode中
11. 修正updateElement方法中只执行一次dangerouslySetInnerHTML的BUG
12. 处理mouseenter/mouseleave的兼容问题
13. 处理focus/blur的兼容问题

## 1.0.7
1. 处理用户在render方法 return this.props.children 的情况，需要将数组转换为单个虚拟DOM
2. 处理两个组件虚拟DOM都没有实例化的情况
3. 只回收文本节点
4. 支持mouseenter/mouseleave及重构事件系统


##1.0.6

1. 重新支持chrome DevTools
2. 添加对Immutable.js的支持
3. 修复用户在componentWillUpdate/shouldComponentUpdate/componentDidUpdate钩子中执行setState引发死循环的BUG


##1.0.5

1. 优化scheduler机制
2. 实现对createFactory的支持
3. 优化dispose模块
4. 使用typeNumber代替typeof关键字，减少打包后的体积


##1.0.4

1. 修正 unable to preventdefault inside passive event listener due to target 的错误处理，
   这是chrome51+, 为了提高性能，默认对touchmove/mousemove/mousewheel事件禁用preventDefault方法引发的问题
2. 销毁元素节点，彻底清除_component与__events引用
3. 取消refs.xxx = null 操作，确保组件销毁后可能还进行动画，这时会有DOM操作不会报错
4. 对props.children进行增强，支持更多合法的类型
5. 实现对createClass的支持
6. 实现对mixin的支持

##1.0.3

1. 实现unstable_renderSubtreeIntoContainer, findDOMNode, isValidElement方法
2. 实现对Children的完整支持 (only, count, forEach,map, toArray)
3. 实现focus, blur, wheel的兼容处理，
4. 修正更新组件时，没有添加defaultProps的BUG
5. 修正diffProps一些错别字
6. 实现事件对象pagex,pageY,which,currentTarget的兼容
7. 修正用户在componentWillMount时调用 setState引发的BUG
8. cloneElement应该能处理数组并取出其第一个元素进制复制 
9. 取消事务机制，改成调度任务

##1.0.2
1. 兼容IE，实现对应的polyfill文件
2. 实现对IE6－8的change, input, submit事件
3. 添加对select.value的处理


##1.0.1
1. 支持cloneElement


##1.0.0
1. 发布anu

