
# 变更日志

## 1.4.6(2018.07.27)

1. 添加cacheContext, mergeContext等方法，如果上面的context不变，那么下方的也不会，这样就阻止了无效的cwrp钩子的触发
2. miniCreateClass添加对微信小程序无法动态执行代码的处理
3. createElement添加对input的处理，高级浏览器不会进行最下面的分支

## 1.4.5(2018.07.06)

1. 调整依赖，不再添加webpack相关的模块
2. 修复对react-hot-loader的支持
3. 修复IE8的input onChange事件的光标问题
4. 修复resetStack BUG
5. 去掉diffProps中的数组解构，减少体积

## 1.4.4(2018.06.22)

1. 修复插入点的BUG，现在dfs遍历过程不再查询元素节点的insertPoint是否存在，updateHostComponent方法也不会调用getInsertPoint，性能大大提升
2. 修复componentWillUnmount钩子中访问this.refs.xxx.parentNode,其父节点不存在的BUG

## 1.4.3(2018.06.14)

1. miniCreateClass在老式IE下取不到名字默认使用IEComponent, 
2. 修复createClass没有继续mixin的BUG 
3. 移除option元素下面所有元素节点
4. 去掉NULLREF任务，添加DUPLEX任务，提前所有dom相关任务
5. 内置的路由器支持IE8的hashchange
6. updateContext改名updateContent，这是一直以来的笔误

## 1.4.2(2018.06.07)

1. add miniCreateClass, 并用它重构createClass, Unbatch, PureComponent, createContext
2. 添加一个WORKING任务，避免整棵树更新
3. 修复受控组件中option的IE8-的兼容BUG
4. 添加一个内置的路由器

## 1.4.1(2018.06.04)

1. 文本节点的内容直接用fiber.props代替
2. 修正input的拼音输入法BUG
3. 修正updateHostComponent中覆盖children对象的BUG
4. 修正createClass BUG
5. 修正SSR的BUG
6. 简化commitDFS循环

## 1.4.0(2018.05.30)

1. 测试全部改成jest
2. cWU钩子在调用时必须移除
3. 批量更新时，每个组件只能更新一次
4. 重构受控组件，它们会延后在batchedUpdate中执行，跑通所有测试
5. emptyElement不再递归移除，但会递归清空附于元素节点上的数据，以防内存泄露
6. 将createClass移出核心库
7. 重构错误边界，边界组件带有capturedValues，catchError, caughtError标识，并放进全局的boundaries
8. 重构contextStack，保证setState后，从当前组件的unmaskedContext中还原之前的栈


## 1.3.2(2018.04.16)

处理移动端下中文输入法的onChange事件BUG

## 1.3.1(2018.03.18)

1. React.Fragment支持key属性
2. 修正有`生命周期的无状态组件`的更新BUG
3. 实现React.createRef与React.forwardRef
4. 实现createResource与createSubscription这两个处理狀态的新包，放于lib下
5. var 集体更改为let const

## 1.3.0(2018.03.06)

1. 支持React16.3的createContext new API
2. 添加大量React.Fragment测试，修正一些边缘的BUG
3. 升级diff机制，由新旧vnode进行比较，改成fiber与新vnode进行比较，用新vnode的数据更新fiber与视图
4. 添加input[type=search]的onChange事件支持
5. 修正传送门在antd3.0的一个边缘BUG（重复插入两次，导致文本节点消失）
6. 属性名与方法名大改动，与React16的Fiber靠近
   * `vnode.vtype` --> fiber.tag
   * `instance.__isStateless` --> fiber._isStateless
   * `updater` --> fiber
   * `updater.vnode` --> fiber._reactInternalFiber
   * `updater.willReceive` --> fiber._willReceive
   * `updater.children` --> fiber._children
   * `updater.isMounted()` --> fiber._isMounted()
   * `updater.insertCarrier` --> fiber._mountCarrier
   * `updater.insertPoint` --> fiber._mountPoint
   * `updater.parentContext` --> fiber._unmaskedContext
   * `getChildContext` --> getUnmaskedContext
   * `getContextByTypes` --> 为getMaskedContext
   * `CompositeUpdater.js` --> ComponentFiber.js`
   * `DOMUpdater.js` --> HostFiber.js


## 1.2.9(2018.02.06)

1. 修正focus/blur事件的实现
2. 修正IE6－8下onchange因为是用onproperty实现，会引发无限循环的BUG
3. 修正diffProps无法修改input元素的type属性的BUG，改为在createElement方法中立即添加type属性

## 1.2.8(2018.02.02)

1. 简化focus/blur事件的实现，IE7－8的实现更加精简了
2. 修正wheel事件的属性计算方式，与官方保持一致
3. 为了支持react-hot-loader, vnode.updater.vnode更名为vnode.updater._reactInnerFiber, vtype更名为tag
4. 测试工具与调试工具进行了部分属性调整

## 1.2.7(2018.02.01)

1. 修正componentWillReceiveProps 的执行条件
2. 支持children为函数
3. 修改_disposed开关的位置
4. 修正焦点系统，它只会在browser的insertElement, removeElement中执行
5. 修正focus/blur事件的绑定方式，捕获时需要屏蔽内部的事件
6. 修正insertElement中多执行一次无效的DOM插入操作及CompositeUpdatet.hydrate的insertElement传参错误

## 1.2.6(2018.01.26)
修正 unstable_renderSubtreeIntoContainer 中context对象的错误指向

## 1.2.5(2018.01.23)

1. 修正受控组件 radio的BUG，它导致无法修改value

## 1.2.4（2018.01.22）

1. 解决移动端scroll事件


## 1.2.3（2018.01.12）

1. 解决移动端点击事件


## 1.2.2(2018.01.05)

1. 解决PropTypes的share问题
2. 修复utils的inherit BUG
3. 添加后端渲染的renderToNodeStream支持
4. Component添加isReactCompent方法，增强对第三方的支持

## 1.2.2(2017.12.30)

1. cloneElement需要处理disposed元素
2. cloneElement 对于props的虚拟DOM进行复制
2. 设置属性的时机提前


## 1.2.1 (2017.12.27)

1. 优化fiberizeChildren的性能
2. 修复受控组件在textarea, radio的BUG，将受控事件放到用户事件后集中执行
3. 添加焦点系统的支持（全局focus,blur事件提前监听，移除添加节点的Refs.nodeOperate开头）
4. 解决多次引入React时，事件系统的option.async有问题的BUG
5. 简化createPortal的实现
6. 支持React16.2的Fragment语法糖


## 1.2.0(2017.12.17) 支持React16

1. 重构findDOMNode,遇到注释节点返回null
2. 支持React组件返回任何数据类型，如数组，字符串，数字，布尔,但对于undefined, null, boolean不会生成真实DOM
3. 支持componentDidCatch钩子与整个错误边界的逻辑
4. 支持createPortal
5. 分离出Vndoe模块，并且附带其节点关系属性（return, sibling, child），
   * return相当于之前的_hostParent,
   * sibling相当于nextSibling, 
   * child相当于firstChild，
6. 模仿React16，使用`stateNode属性`代替旧有的_hostNode与_instance。 
7. React.Children与flattenChilden底层依赖的方法由_flattenChildren改为operateChildren，让其更具通用性，
   flattenChilden更名为fiberizeChildren，产出一个`带链表结构的数组`。
8. 新的架构：元素虚拟DOM与组件虚拟DOM都有自己的更新对象，简化匹配算法
9. 简化Refs模块
10. 修复更新虚拟DOM时，namespaceURI丢失的BUG
11. componentDidUpdate现在只有两个参数，lastProps与lastState
    


## 1.1.4（2017.10.20）

1. 修正flushUpdaters中updater对象的泄露问题（需要clearArray一下）
2. 优化diffChildren的逻辑，防止出现parentNode等于null的情况（比如为文本节点取firstChild）
3. 简化ControlledComponent与dispose模块
4. 处理updateElement方法中两个虚拟DOM的引用一样时，调用flattenChildren时，旧的vchildren丢失的情况
5. 移除Refs中的createStringRef，createInsanceRef，添加fireRef,
   重构detachRef,clearRefs,cloneElement,createElement有关ref的部分，尽量减少闭包的应用
6. 将updateQueue数组移出所有diff方法，合并到调度器中

## 1.1.3（2017.10.08）

1. 抽象出一个Update类，用于封装组件实例上的所有私有数据
2. 抽象出一个instantiateComponente用于同时实例化有状态与无状态组件，从此再没有mountStateless, updateStateless方法
3. 修正checkbox点一下会触发两次onChange的BUG
4. 添加ReceiveComponent检测机制，如果context,props一样，那么就不会执行receive, render, update等钩子
5. 修改检测空对象的逻辑
6. 简化任务调度系统的逻辑

## 1.1.2（2017.10.01）

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

## 1.1.1（2017.9.9）

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

## 1.1.0（2017.08.28）

1. disabled的元素不能触发点击事件
2. 修正mouseenter/mouseleave在IE6－8中的BUG，涉及到relatedTarget的正确获取与LCA处理
3. 简化alignVnode的逻辑，减少插入列队的生成
4. 重构setStateImpl,
5. `_component`更名为`__component`, `_currentElement`更名为`__current`
6. react/lib中添加一些简用的外围模块，如ReactComponentWithPureRenderMixin，shallowCompare，sliceChildren


## 1.0.8（2017.08.18）

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

## 1.0.7（2017.07.29）

1. 处理用户在render方法 return this.props.children 的情况，需要将数组转换为单个虚拟DOM
2. 处理两个组件虚拟DOM都没有实例化的情况
3. 只回收文本节点
4. 支持mouseenter/mouseleave及重构事件系统


## 1.0.6（2017.07.24）

1. 重新支持chrome DevTools
2. 添加对Immutable.js的支持
3. 修复用户在componentWillUpdate/shouldComponentUpdate/componentDidUpdate钩子中执行setState引发死循环的BUG


## 1.0.5（2017.07.14）

1. 优化scheduler机制
2. 实现对createFactory的支持
3. 优化dispose模块
4. 使用typeNumber代替typeof关键字，减少打包后的体积


## 1.0.4 （2017.07.07）

1. 修正 unable to preventdefault inside passive event listener due to target 的错误处理，
   这是chrome51+, 为了提高性能，默认对touchmove/mousemove/mousewheel事件禁用preventDefault方法引发的问题
2. 销毁元素节点，彻底清除_component与__events引用
3. 取消refs.xxx = null 操作，确保组件销毁后可能还进行动画，这时会有DOM操作不会报错
4. 对props.children进行增强，支持更多合法的类型
5. 实现对createClass的支持
6. 实现对mixin的支持

## 1.0.3 （2017.07.25）

1. 实现unstable_renderSubtreeIntoContainer, findDOMNode, isValidElement方法
2. 实现对Children的完整支持 (only, count, forEach,map, toArray)
3. 实现focus, blur, wheel的兼容处理，
4. 修正更新组件时，没有添加defaultProps的BUG
5. 修正diffProps一些错别字
6. 实现事件对象pagex,pageY,which,currentTarget的兼容
7. 修正用户在componentWillMount时调用 setState引发的BUG
8. cloneElement应该能处理数组并取出其第一个元素进制复制 
9. 取消事务机制，改成调度任务

## 1.0.2 （2017.06.20）

1. 兼容IE，实现对应的polyfill文件
2. 实现对IE6－8的change, input, submit事件
3. 添加对select.value的处理


## 1.0.1 （2017.06.09）

1. 支持cloneElement


## 1.0.0 （2017.06.05）
1. 发布anu

