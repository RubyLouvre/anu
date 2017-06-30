##事件系统 

早期的DOM 0事件系统，是在标签内直接添加 onxxx="fn"属性，这有巨大的缺点：

一是只能应用于冒泡阶段
二是fn为全局函数
三是this与事件对象存在兼容性问题

但onxxx方法非常明了，因此React对它做了一些改进，

1. onClick属性可以在后面添加Capture字样，让它在捕获阶段执行，即onClick对应着onClickCapture， onChange对应着onChangeCapture
2. 回调函数通过编译手段，将它改成局部
3. 回调的this指向组件实例，事件对象框架做了标准化处理，并且通过回收机制，不断重复使用此方法。

```jsx
<div onClick={this.onClickHandle} onClickCaputure={this.onClickHandle2}>点我</div>
```


在React.createClass时代，组件的回调函数都是自动bind this，保持它们总是指向实例本身。但是在es6时，则没有这个免费服务了。

你可以通过**babel-plugin-transform-class-properties**这插件， 实现在class块中直接使用箭头函数。众所周知， 箭头函数是autobind this的

```
let {Component, PropTypes} = React;

export default class MyComponent extends Component {  
  // lifecycle methods and statics
  static propTypes = {
    foo: PropTypes.bool.isRequired
  }

  handler = (e) => { ... }

  // render actual DOM output
  render() {
    return <div onClick={this.handler}></div>;
  }
}
```

此外你也可以使用autobind-decorator这个模块，直接用es7的注解 搞定这个问题

anujs在0.0.3版，可以通过React.eventSystem来访问各种事件API

[https://github.com/andreypopp/autobind-decorator](https://github.com/andreypopp/autobind-decorator)

```jsx

import autobind from 'autobind-decorator'

class Component {
  constructor(value) {
    this.value = value
  }

  @autobind
  method() {
    return this.value
  }
}

let component = new Component(42)
let method = component.method // .bind(component) isn't needed!
method() // returns 42


// Also usable on the class to bind all methods
@autobind
class Component { }
```

 如果大家想在移动端使用触屏事件，可以尝试使用** libs/injectTapEventPlugin.js **

```html
<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width">
    </style>
     <script type='text/javascript' src="./dist/React.js"></script>
     <script type='text/javascript' src="./libs/injectTapEventPlugin.js"></script>
     <script type='text/javascript' src="./libs/babel.js"></script>
  <script type='text/babel'>
  injectTapEventPlugin() //必须执行这个
  window.onload = function(){
  
    class App extends React.Component {
      constructor(props) {
        super(props);
        this.state = {
          aaa: 1111
        };
      }
      componentWillMount() {
        this.state = {
            aaa: 333
          }
        this.forceUpdate();
      }
      render() {
        return <p onTouchTap={(e)=>{ console.log('用户触发',e.type)}}>{this.state.aaa}</p>;
      }
    }
    var s = ReactDOM.render(<App />, document.getElementById('example'));
  }
  </script>

</head>

<body>

    <div>开发者工具</div>
    <div id='example'></div>

</body>

</html>

```