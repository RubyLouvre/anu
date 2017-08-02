##1.0.0
1. 发布anu

##1.0.1
1. 支持cloneElement

##1.0.2
1. 兼容IE，实现对应的polyfill文件
2. 实现对IE6－8的change, input, submit事件
3. 添加对select.value的处理


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

##1.0.4

1. 修正 unable to preventdefault inside passive event listener due to target 的错误处理，
   这是chrome51+, 为了提高性能，默认对touchmove/mousemove/mousewheel事件禁用preventDefault方法引发的问题
2. 销毁元素节点，彻底清除_component与__events引用
3. 取消refs.xxx = null 操作，确保组件销毁后可能还进行动画，这时会有DOM操作不会报错
4. 对props.children进行增强，支持更多合法的类型
5. 实现对createClass的支持
6. 实现对mixin的支持



##1.0.5

1. 优化scheduler机制
2. 实现对createFactory的支持
3. 优化dispose模块
4. 使用typeNumber代替typeof关键字，减少打包后的体积

##1.0.6

1. 重新支持chrome DevTools
2. 添加对Immutable.js的支持
3. 修复用户在componentWillUpdate/shouldComponentUpdate/componentDidUpdate钩子中执行setState引发死循环的BUG


## 1.0.7
1. 处理用户在render方法 return this.props.children 的情况，需要将数组转换为单个虚拟DOM
2. 处理两个组件虚拟DOM都没有实例化的情况
3. 只回收文本节点
4. 支持mouseenter/mouseleave及重构事件系统

## 1.0.8
1. event.originalEvent更名为 event.nativeEvent
2. 修正polyfill中的BUG
3. 调整scheduler机制
4. 修正typeNumber在iE6－8下的BUG
