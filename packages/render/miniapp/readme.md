# React转微信小程序的转码器

## 使用
命令行定义到cli目录下，执行npm link
使用mpreact `<project-name>` 创建工程
定位到  `<project-name>` 目录下 `mpreact start` 开始监听文件变化，
用微信开发工具打开当中的dist目录，自己收在src目录中进行开发

## 与原生小程序的优势

1. 使用rollup进行编译，天然支持 Tree Shaking
2. 支持在视图中写事件回调的函数体，支持复杂的传参
3. ReactWX.wx拥有小程序的wx的所有方法，但是对回调风格的方法全部转换成Promise风格
4. 支持组件继承

## 与React的差异

1. 微信小程序的事件机制有瑕疵，不支持stopPropagation与preventDefault。我们将e.detail当成事件对象，在它基础上添加type,target,touches,timeStamp等属性
2. 事件的绑定，不要使用this.props.fn或this.state.fn，要用this.fn这种形式，微信在给模板填数据时，会对数据进行JSON.stringify，清掉所有事件。
3. 组件系统是基于小程序的template元素，由于不支持slot，因此无法使用`{this.props.children}`实现显式的组件套嵌
4. 不完整支持ref机制（refs可以放入组件实例，但不能放DOM，因为没有DOM）
5. 还没有支持findDOMNode
6. 不支持render props
7. 不支持dangerouslySetInnerHTML属性
8. jsx中的`{}`的值应该this.props或this.state，事件回调应该来自this
9. src目录下面有components与pages目录，components是集中定义组件，可以用继承，pages里面是页面，只能继承React.Component

## 内部运行机制

index.js parse方法利用rollup解析得到整个工程的所有文件
index.js codegen方法的transform方法处理所有JS文件
transform的实现是在transform.js文件中，它先根据目录名与文件，给当前modules对象添加一个moduleType属性Page/Component/App

ransform利用babel.core来进行解析文件，需要用到已有或自己定义的babel插件， 已有插件是"syntax-jsx",
"transform-decorators-legacy",  "transform-object-rest-spread",自定义插件是miniappPlugin。

miniappPlugin的主体是定义在reactTranslate.js中

reactTranslate.js 就是一个AST遍历器的集合，包含了ClassDeclaration，FunctionDeclaration，ExportNamedDeclaration，ClassProperty，CallExpression，JSXOpeningElement，JSXClosingElement等表达式的转译操作

ClassDeclaration会将用户的es6转换React.miniCreateClass的方法创建类，

ClassMethod是用来 处理render方法，会转换成两套模块，一个是JSX的纯JS形式即React.createElement，一套是wxml

