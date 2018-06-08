## react-core

只涉及React的一些工厂类，不涉及虚拟DOM与界面是如何交互更新的

* createElement: 创建虚拟DOM ，描述一个视图显示单元或一个业务逻辑容器
* cloneElement: 复制已经虚拟DOM ，并可以加入更多属性
* createFactory: createElement的包装，curry函数
* createPortal: 创建一个不依赖于父节点的单独子树
* createContext: 创建一组可以穿梭于多层虚拟DOM的通信工具
* createRef与forwardRef: 创建引用对象
* createClass: React15之前，用于创建业务逻辑类的工厂
* Component: 内置的组件类
* PureComponent: 内置的组件类
* Children: 一组用来操作props.chilren的工具集合
* createRenderer: React内部的渲染对象，用户需要针对不同的底层重写部分接口
