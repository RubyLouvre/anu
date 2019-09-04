## react-fiber

React16的fiber调度器的迷你实现，将用户对虚拟DOM的所有操作进行更细致的划分，
调用底层API执行视图更新与业务逻辑


scheduleWork主要包含两个方法`render`与`updateComponent`, 用于驱动视图变化。 

render即ReactDOM.render, 内部会调用updateComponent。
updateComponent即组件的setState/forceUpdate的具体实现。

render要跑起来，需要一个组件，因此React.render(vdom, container, cb)中的前两个参数间会嵌入一个内置组件Unbatch!
于是有unbatch.js模块。

```jsx
<container><Unbatch><vdom /></Unbatch></container>
```

render会将vdom放进macrotask列队。

updateComponent里面有一个scheduleWork方法。

scheduleWork是performWork的封装

performWork是requestIdleCallback<伪>的回调。

requestIdleCallback之所以带伪字，因为它不是浏览器的原生方法。 为了也能跑在nodejs端，React内置了这同名方法，虽然参数与原生的很像，但它的行为会视平台有所不同。

```javascript
let deadline = {
    didTimeout: false,
    timeRemaining() {
        return 2;
    },
};

function requestIdleCallback(fn) {
    fn(deadline);
}
Renderer.scheduleWork = function() {
    performWork(deadline);
};
```

performWork会像经典rAF 动画那样递归调整自身，直到耗尽macrotasks里面的任务.
```javascript
function performWork(deadline) {
    //更新虚拟DOM与真实DOM
    workLoop(deadline);
   //忽略其他往macrotasks中添加任务的代码。。。
   //忽略其他往macrotasks中添加任务的代码。。。
   //忽略其他往macrotasks中添加任务的代码。。。
    if (macrotasks.length) {
        requestIdleCallback(performWork);
    }
}
```

workLoop相当于浏览器中的EventLoop, 用于执行macrotasks与micotasks里面的任务。

1. macrotasks，宏列队，主进程，一个页面只有一个。
2. microtasks，微列队，子进程，每棵虚拟DOM树都有一个，放在根节点中。当组件执行setState后，它会找到根节点的microtasks，然后放进去。然后在下次唤起performWork时，再将它们挪到同macrotasks。

workLoop里面有两个DFS 遍历，分别来自beginWork的reconcileDFS, commitWork的commitDFS。 reconcile与commit代表了React16更新时的两个阶段。

beginWork中有updateClassComponent与updateHostComponent,分别用于更新组件与DOM。

commitWork主要是执行DOM 操作， REF 操作， 组件的回调与错误边界。

insertPoint用于决定DOM 节点是插入位置。

ErrorBoundary用于查找`边界组件`，及合成`错误组件`的位置信息。

effectTag 基于质数相除的任务系统。