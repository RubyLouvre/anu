## react16的迷你实现

core: 放置一些公用接口

fiber: 放置调度器，比较有趣. 包含有时间分片，错误处理，批量更新，任务收集，任务分拣。。。

render: 放置渲染层的具体实现，比如createElement, 在dom里面就是document.createElement, 它会考虑到复杂的文档空间切换; 

在noop里只是一个包含type, props, children的纯对象; 在server里面就是可以一个能序列化为字符串的对象。

