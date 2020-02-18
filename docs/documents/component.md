# 通用组件

通用组件必须定义在 `components` 目录中，里面建一个`文件夹与组件名`同名，下面 `index.js` 就是你编写组件的地方。

## 组件的样板

```jsx
//components/Animal/index.js
import React from '@react';

class Animal extends React.Component { //组件名必须大写开头，与目录名一样
  constructor(props) {
    super();
    this.state = {
      name: props.name,
      age: props.age || 1
    };
  }

  static defaultProps = {
    age: 1,
    name: 'animal'
  };

  static options = {
    styleIsolation:"apply-shared" //微信，QQ support
    addGlobalClass: true, //微信，QQ，百度 support
  };

  changeAge() {
    this.setState({
      age: ~~(Math.random() * 10)
    });
  }

  componentDidMount() {
    console.log('Animal componentDidMount');
  }

  componentWillReceiveProps(props) {
    this.setState({
      name: props.name
    });
  }

  render() {
    return (
      <div style={{ border: '1px solid #333' }}>
        名字：
        {this.state.name} 年龄：
        {this.state.age} 岁
        <button catchTap={this.changeAge.bind(this)}>换一个年龄</button>
      </div>
    );
  }
}

export default Animal;
```

options.styleIsolation 被微信，QQ这几个小程序所支持。

- isolated 表示启用样式隔离，在自定义组件内外，使用 class 指定的样式将不会相互影响（一般情况下的默认值）；
- apply-shared 表示页面 wxss 样式将影响到自定义组件，但自定义组件 wxss 中指定的样式不会影响页面；
- shared 表示页面 wxss 样式将影响到自定义组件，自定义组件 wxss 中指定的样式也会影响页面和其他设置了 apply-shared 或 shared 的自定义组件。（这个选项在插件中不可用。）

由于目录可能比较深，因此 nanachi 比较贴心地提供了两个默认的别名，`@react` 与 `@components`, `@react` 指向专门为小程序优化的 React, `@components` 指向开发目录下的 `components` 目录。

JSX 只能出现在 `render()` 方法或无状态组件的函数体中。

JSX 的所有填充数据必须带 `this.props`, `this.state`, `this.context` 前缀。

`render()` 方法里不能出现 `var/const/let` 语句，只能出现 `if` 语句与三元表达式或 JSX。

`map()` 方法调用的第一个参数最好使用匿名方法（因为这样会自动 bind `this`），否则它会自动添加上第二个参数 `this`

```jsx
<div class="group">
  {this.state.iconSize.map(function(item) {
    return <icon type="success" size={item} />;
  })}
</div>
```

会变成

```jsx
<div class="group">
  {this.state.iconSize.map(function(item) {
    return <icon type="success" size={item} />;
  }, this)}
</div>
```

JSX 禁止出现 `instanceUid`, `classUid`, `eventUid`, 这些是内部绑定事件时在编译阶段自动添加的。

render方法的第一个语句只能元素节点，不能是三元表达式或if语句等表示逻辑性的东西
错误的写法
```jsx
class Dog extends React.Component{
  //....略
  render(){
    return this.props.xxx ? <div>分支1</div>: <div>分支2</div>
  }
}
```
正确的写法
```jsx
class Dog extends React.Component{
  //....略
  render(){
    return <div>{this.props.xxx ? <div>分支1</div>: <div>分支2</div>}</div>
  }
}
```
原因是三元表达式会变成block标签，而快应用与自定义组件方式不支持顶层元素为template/block