# anu

<p align="center">
<a href="https://badge.fury.io/js/anujs">
<img src="https://badge.fury.io/js/anujs.svg" alt="npm version" height="18">
</a>
<a href="https://travis-ci.org/RubyLouvre/anu">
<img src="https://travis-ci.org/RubyLouvre/anu.svg?branch=master" alt="Travis CI Status"/>
</a>
<a href="https://codeclimate.com/github/RubyLouvre/anu">
<img src="https://codeclimate.com/github/RubyLouvre/anu/badges/gpa.svg" />
</a>
</p>


```
npm install anujs
```

anu, 读作［安努］，原意为苏美尔的主神。



众所周知，React 一直存在体积过大的诟病，集成了许多在线上环境不需要功能, 因此我在熟读其源码的基础上，去芜存精，重新实现了 React 所有公开接口，体积只有其五分之一，从而解决它在移动端上加载过慢的问题。由于没有使用高级 API，因此只需在 webpack ,uglify 上修改配置，便能运用于 IE8 上，从而解决 PC 端同学使用 React 的问题。

与其他迷你react的比较 

相对于preact， 它的通用性更好， preact是通过preact-compat实现对React的API的兼容，里面用于了Object.definePropety，这会造成两个问题。
一是无法运用于IE8中，二，用于Object.defineProperty,其性能立即从70帧掉到30帧。

相对于react-lite, anujs的事件系统更具扩展性。官方的react-dom，近2万行，有一半花在事件系统上，对mouseenter/mouseleave/focus/blur/change等不可冒泡的事件进行模拟冒泡，react-lite简单几行是实现不了那个效果的。
anujs是作者是精通DOM操作，也费了好大劲才实现的。

![](https://segmentfault.com/img/bVTQUW?w=600&h=492)

![](https://segmentfault.com/img/bVTVnz?w=876&h=536)

－－－－－－－－－－


特点：

1. 支持React的无狀态组件，纯组件，高阶组件，受控组件与[非受控组件](https://github.com/RubyLouvre/anu/wiki/%E9%9D%9E%E5%8F%97%E6%8E%A7%E7%BB%84%E4%BB%B6)，
2. 命名空间就是React，此外还暴露了另一个别名ReactDOM在window上
3. 体积足够少，min为60k, gz后为16中，2000多行代码（相对于react+react-dom是3MB与3万行代码)
4. 性能稳定在60帧，使用的是基于列队的异步机制
5. 生命周期函数的参数与官方保持一致
6. 直接与[react-redux, react-router-dom, react-router-redux](https://github.com/RubyLouvre/anu/wiki/react-router-redux%E7%9A%84%E8%B7%AF%E7%94%B1%E4%BE%8B%E5%AD%90)混用
7. 支持[后端渲染](https://github.com/RubyLouvre/anu/wiki/%E5%90%8E%E7%AB%AF%E6%B8%B2%E6%9F%93)
8. 支持[官方的chrome DevTools](https://github.com/RubyLouvre/anu/wiki/react-chrome%E5%BC%80%E5%8F%91%E8%80%85%E5%B7%A5%E5%85%B7)


![image](https://segmentfault.com/img/remote/1460000009659322?w=2450&h=768)



详细用法与示例见 ** [wiki](https://github.com/RubyLouvre/anu/wiki) **

```html
<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width">
    <script type='text/javascript' src="./dist/React.js"></script>
    <script src="https://cdn.bootcss.com/babel-standalone/6.24.0/babel.js"></script>

    <script  type="text/babel" >
       class A extends React.PureComponent {
            constructor(props) {
                super(props)
                this.state = {
                    aaa: {
                        a: 7
                    }
                }
            }
          
            click() {
                this.setState(function(state){
                   state.aaa.a = 8
                })
            }
            render() {
                return  <div onClick={this.click.bind(this) }>{this.state.aaa.a}</div>
            }
        }
        window.onload = function () {
            ReactDOM.render(<A />, document.getElementById('example'))
        }
    </script>
</head>

<body>
    <div>这个怎么点击也不会变</div>
    <blockquote id='example'></blockquote>


</body>

</html>
```
-----------


与Redux使用的例子
```html
<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width">
    <script type='text/javascript' src="./dist/React.js"></script>
    <script src="https://cdn.bootcss.com/redux/3.6.0/redux.js"></script>

    <script src="./test/babel.js"></script>
    <script type='text/babel'>
        var addTodoActions = function (text) {
            return {
                type: 'add_todo',
                text: text
            };
        }
        var todoReducer = function (state, action) {

            if (typeof state === 'undefined') {
                return [];
            }

            switch (action.type) {
                case 'add_todo':
                    return state.slice(0).concat({
                        text: action.text,
                        completed: false
                    });
                    break;
                default:
                    return state;
            }
        };
        var store = Redux.createStore(todoReducer);
        class App extends React.Component {
            constructor(props){
                super(props)
                this.state = {
                    items: store.getState()
                }
                this.onChange = this.onChange.bind(this)
                this.handleKeyUp = this.handleKeyUp.bind(this)
                this.handleAdd = this.handleAdd.bind(this)
            }
            componentDidMount(){
                var unsubscribe = store.subscribe(this.onChange);
            }
            onChange(){
                this.setState({
                    items: store.getState()
                });
            }
            handleKeyUp(e){
                if(e.which === 13){
                   this.handleAdd()
                }
            }
            handleAdd(){
                var input = this.refs.todo
                var value = input.value.trim();

                if(value)
                    store.dispatch(addTodoActions(value));

                input.value = '';
            }
            render(){
                return (
                    <div>
                        <input ref="todo" type="text" placeholder="输入todo项" style={{marginRight:'10px'}} onKeyUp={this.handleKeyUp} />
                        <button onClick={this.handleAdd}>点击添加</button>
                        <ul>
                            {this.state.items.map(function(item){
                                return <li>{item.text}</li>;
                            })}
                        </ul>
                    </div>            
                    );
            }
        };

ReactDOM.render(
    <App />, 
    document.getElementById('example')
    );
    </script>
</head>

<body>

    <div>测试</div>
    <blockquote id='example'></blockquote>


</body>

</html>

```



