## react-fiber

React16的fiber调度器的迷你实现，将用户对虚拟DOM的所有操作进行更细致的划分，
调用底层API执行视图更新与业务逻辑


scheduleWork主要包含两个方法render与updateComponent, 用于驱动视图变化。 
render内部也用updateComponent实现。

beginWork更新或实例化每棵子树的数据（DOM或实例）

collectWokr收集每棵子树的突变节点

commitWork 通过质数相除的方法执行effectTag对应的任务