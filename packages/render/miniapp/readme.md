# React转微信小程序的转码器

测试例子：npm run miniapp



index.js parse方法利用rollup解析得到整个工程的所有文件
index.js codegen方法的transform方法处理所有JS文件
transform的实现是在transform.js文件中，它先根据目录名与文件，给当前modules对象添加一个moduleType属性Page/Component/App

ransform利用babel.core来进行解析文件，需要用到已有或自己定义的babel插件， 已有插件是"syntax-jsx",
"transform-decorators-legacy",  "transform-object-rest-spread",自定义插件是miniappPlugin。

miniappPlugin的主体是定义在reactTranslate.js中

reactTranslate.js 就是一个AST遍历器的集合，包含了ClassDeclaration，FunctionDeclaration，ExportNamedDeclaration，ClassProperty，CallExpression，JSXOpeningElement，JSXClosingElement等表达式的转译操作

ClassDeclaration会将用户的es6转换React.miniCreateClass的方法创建类，

ClassMethod是用来 处理render方法，会转换成两套模块，一个是JSX的纯JS形式即React.createElement，一套是wxml

