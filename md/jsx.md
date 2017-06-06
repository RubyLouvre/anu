##JSX

React的核心机制之一就是可以在内存中创建虚拟DOM。React利用虚拟DOM来减少对实际DOM的操作从而提升性能。 

为了方便使用虚拟DOM，React发明了JSX， 可以简单地理解它是一种在JS中编写与XML类似的语言。通过JSX来声明组件的属性，类型与结果，并且通过｀{}`插值，套嵌JS逻辑与子级的JSX。

要JSX语法，你必须要引入babel的JSX解析器，把JSX转化成JS语法，这个工作会由babel自动完成。同时引入babel后，你就可以使用新的es6语法，babel会帮你把es6语法转化成es5语法，兼容更多的浏览器。

大家可以在这里下载最新版babel

[http://www.bootcdn.cn/babel-core/](http://www.bootcdn.cn/babel-core/)


我们从最简单的一个官网例子helloworld开始：
```html
  <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8" />
      <title>Hello React!</title>
      <script src="anu.js"></script>
      <script src="https://cdn.bootcss.com/babel-core/6.1.19/browser.min.js"></script>
    </head>
    <body>
      <div id="example"></div>
      <script type="text/babel">
        ReactDOM.render(
          <h1>Hello, world!</h1>,
          document.getElementById('example')
        );
      </script>
    </body>
  </html>
```

script标签里面的内容实际会被编译成

```javascript
ReactDOM.render(
    React.createElement('h1',null, 'Hello, world!'),
    document.getElementById('example')
);

```

又如
```jsx
var root =(
  <ul className="my-list">
    <li>First Text Content</li>
    <li>Second Text Content</li>
  </ul>
);
```

会被编译成
```javascript
var root = React.createElement('ul', { className: 'my-list' },
    React.createElement('li', null, 'First Text Content'),
    React.createElement('li', null, 'Second Text Content')
);
```

###JSX语法介绍

｀{}`插值是让JSX区别普通HTML的一个重要特性，只有三个地方可以使用它。可以放属性名的地方，属性等于号之后的位置及innerHTML之间。

1.**可以放属性名的地方**,  这里只能使用`JSXSpreadAttribute`(延伸属性)， 换言之，括号内必须带三个点号

```jsx
var props = {};
props.foo = x;
props.bar = y;
var component = <Component {...props} />;
```

2.**属性等于号之后的位置**, JSX的属性值必须用引号括起来，当你将引号改成花括号，它里面就可以使用JSX变量了。相当于其他框架的绑定属性或指令。需要说明一下，HTML的固有属性必须使用JS形式，保持驼峰风格，如class要用className代替，for要用htmlFor代替，tabindex要用tabIndex代替，colspan要用colSpan代替。

```jsx
<div tabIndex＝{this.props.a} />
```
花括号里面可以使用三元表达式
```jsx
var person = <Person name={window.isLoggedIn ? window.name : ''} />;
```
会编译成
```javascript
var person = React.createElement(
  Person,
  {name: window.isLoggedIn ? window.name : ''}
);
```


3.**innerHTML**

```jsx
<div>xxx{111}yyy</div>
```

这个会编译成,  `相邻的字任串或数字会合并成一个字符串`，`布尔，null, undefined会被忽略掉`。
```javascript
React.createElement('div',null,"xxx111yyy")
```

在innerHTML里面，我们可以使用数组或数组的map方法生成一个新数组的方法，为当前父元素添加一堆子元素。

```jsx
var ul = (
  <ul className="unstyled">
    {
        this.todoList.todos.map(function (todo) {
            return  (
                <li>
                <input type="checkbox" checked={todo.done}>
                <span className={'done-' + todo.done}>{todo.text}</span>
                </li>
            );
        })
    }
  </ul>
);
```

###JSX中绑定事件

JSX让事件直接绑定在元素上。


```jsx
<button onClick={this.checkAndSubmit.bind(this)}>Submit</button>
```

和原生HTML定义事件的唯一区别就是JSX采用驼峰写法来描述事件名称，大括号中仍然是标准的JavaScript表达式，返回一个事件处理函数。

React并不会真正的绑定事件到每一个具体的元素上，而是采用事件代理的模式：在根节点document上为每种事件添加唯一的Listener，然后通过事件的target找到真实的触发元素。这样从触发元素到顶层节点之间的所有节点如果有绑定这个事件，React都会触发对应的事件处理函数。这就是所谓的React模拟事件系统。尽管整个事件系统由React管理，但是其API和使用方法与原生事件一致。

###JSX中使用样式

在JSX中使用样式和真实的样式也很类似，通过style属性来定义，但和真实DOM不同的是，`属性值不能是字符串而必须为对象｀。
```jsx
<div style={{color: '#ff0000', fontSize: '14px'}}>Hello World.</div>
```

或者
```jsx
var style = {
  color: '#ff0000',
  fontSize: '14px'
};

var node = <div style={style}>HelloWorld.</div>;
```

要明确记住,{}里面是JS代码,这里传进去的是标准的JS对象。在JSX中可以使用所有的的样式，基本上属性名的转换规范就是将其写成驼峰写法，例如“background-color”变为“backgroundColor”, “font-size”变为“fontSize”，这和标准的JavaScript操作DOM样式的API是一致的。

###HTML转义

在组件内部添加html代码,并将html代码渲染到页面上。React默认会进行HTML的转义，避免XSS攻击，
如果要不转义，可以使用dangerouslySetInnerHTML属性。dangerouslySetInnerHTML要求对应一个对象，里面有一个叫__html的字符串。React故意搞得这么难写，目的让大家少点用它。

```jsx
var content='<strong>content</strong>';    

React.render(
    <div dangerouslySetInnerHTML={{__html: content}}></div>,
    document.body
);
```


###自定义组件

组件定义之后，可以利用XML语法去声明，而能够使用的XML Tag就是在当前JavaScript上下文的变量名,该变量名就是组件名称。

一般来说，我们可以通过标签名的第一个字母是大写还是小写来识别组件与普通标签。

```
class HelloWorld extends React.Component{
  render() {
    return (
      <p>
        Hello, <input type="text" placeholder="Your name here" />!
        It is {this.props.date.toTimeString()}
      </p>
    );
  }
};

setInterval(function() {
  ReactDOM.render(
    <HelloWorld date={new Date()} />,
    document.getElementById('example')
  );
}, 500);

```