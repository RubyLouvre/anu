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

此框架的创立之意有三： 

1. 提升性能， 虽然React的性能相对于传统的MVVM框架是很厉害了，但近几年冒出来的diff算法比官方版更优秀，官方版积重难返，很难短时期吸收这些成果。anu则小船好调头，第一时间收纳其中。性能是王道。天下武功，唯快不破。

2. 压缩体积。 React+React-dom加起来有三万多行，这么大的体量任何code splitting与按需加载技术都无能为力，因此我们需要迷你版的体积。

3. 卓越的浏览器兼容性。 React在生产环境中没有用到什么新式偏门的API，因此本来就可以兼容到IE8之下。兼容性越好，我们的后顾之忧越少。

－－－－－－－－－－


特点：

1. 支持React的无狀态组件，纯组件，高阶组件，受控组件与[非受控组件](https://github.com/RubyLouvre/anu/wiki/%E9%9D%9E%E5%8F%97%E6%8E%A7%E7%BB%84%E4%BB%B6)，
2. 命名空间就是React，此外还暴露了另一个别名ReactDOM在window上
3. 体积足够少(1700行相对于react+react-dom的3万行)
4. 性能是官方React的近**两倍**或更高  [测试页面](https://github.com/RubyLouvre/anu/blob/master/pref/anu.html)、 [结果统计](https://github.com/RubyLouvre/anu/issues/10#issuecomment-305694971)
5. 生命周期函数的参数与官方保持一致
6. 直接与[react-redux, react-router-dom, react-router-redux](https://github.com/RubyLouvre/anu/wiki/react-router-redux%E7%9A%84%E8%B7%AF%E7%94%B1%E4%BE%8B%E5%AD%90)混用
7. 支持[后端渲染](https://github.com/RubyLouvre/anu/wiki/%E5%90%8E%E7%AB%AF%E6%B8%B2%E6%9F%93)
8. 支持[官方的chrome DevTools](https://github.com/RubyLouvre/anu/wiki/react-chrome%E5%BC%80%E5%8F%91%E8%80%85%E5%B7%A5%E5%85%B7)


![image](https://cloud.githubusercontent.com/assets/190846/26769869/e5e1f6c0-49e4-11e7-94c9-f106179cf40f.png)





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





### 测试 

依赖于

```
+ [selenium-server-standalone](http://selenium-release.storage.googleapis.com/3.3/selenium-server-standalone-3.3.1.jar)
+ [chromedriver](https://sites.google.com/a/chromium.org/chromedriver/), [more available drivers](http://www.seleniumhq.org/projects/webdriver/)
+ nodejs v6.10.0+
+ karma
```

cli


```
npm install selenium-standalone
selenium-standalone install --config=./s.js
selenium-standalone start
//另开窗口
npm run build
```
或者

```
//linux32可以改成mac, window

 wget https://chromedriver.storage.googleapis.com/2.29/chromedriver_linux32.zip
 unzip chromedriver_linux32.zip
 wget http://selenium-release.storage.googleapis.com/3.3/selenium-server-standalone-3.3.1.jar
 java -jar selenium-server-standalone-3.3.1.jar
//另开窗口
    npm run build

```
