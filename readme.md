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

读作 安努 ，苏美尔的主神，开天辟地。一个无痛替换线上React的迷你React框架
QQ交流学习群：  370262116

特点：

1. 支持React的无狀态组件，纯组件，高阶组件，受控组件与[非受控组件](https://github.com/RubyLouvre/anu/wiki/%E9%9D%9E%E5%8F%97%E6%8E%A7%E7%BB%84%E4%BB%B6)，
2. 命名空间就是React，此外还暴露了另一个别名ReactDOM在window上
3. 体积足够少(2000行相对于react+react-dom的3万行, gz为其1/5大小)
4. 性能是官方React的**两倍**以上  [测试页面](https://github.com/RubyLouvre/anu/blob/master/pref/anu.html)、 [结果统计](https://github.com/RubyLouvre/anu/issues/10#issuecomment-305694971)
5. 生命周期函数的参数与官方保持一致
6. 直接与[react-redux, react-router-dom, react-router-redux](https://github.com/RubyLouvre/anu/wiki/react-router-redux%E7%9A%84%E8%B7%AF%E7%94%B1%E4%BE%8B%E5%AD%90)混用
7. 支持[后端渲染](https://github.com/RubyLouvre/anu/wiki/%E5%90%8E%E7%AB%AF%E6%B8%B2%E6%9F%93)
8. 支持[官方的chrome DevTools](https://github.com/RubyLouvre/anu/wiki/react-chrome%E5%BC%80%E5%8F%91%E8%80%85%E5%B7%A5%E5%85%B7)

脚手架  https://github.com/Levan-Du/anu-cli


![image](https://cloud.githubusercontent.com/assets/190846/26769869/e5e1f6c0-49e4-11e7-94c9-f106179cf40f.png)

### dist目录下的变种说明
1. React 支持IE9+, 拥有PropTypes, createClass, createFactory
2. ReactIE 支持IE6+, 拥有PropTypes, createClass, createFactory (需要与lib目录下的polyfill配套使用)
3. ReactShim 支持IE9＋，不再拥有废弃API，删除了PropTypes, createClass, createFactory， unstable_renderSubtreeIntoContainer(如果大家只用在移动项目，并且使用es6方式定义组件，**建议**使用这个文件！)

### 开源协议 
Apache Licene 2.0

### 低版本浏览器的支持 

1. 使用**polyfill.js** https://github.com/RubyLouvre/anu/blob/master/lib/polyfill.js
2. 或使用babel polyfill功能

如果想用anujs代替已经用React.js写好或正在进行的的项目，可以这样配置webpack
```js
resolve: {
   alias: {
      'react': 'anujs',
      'react-dom': 'anujs',
        // 若要兼容 IE 请使用以下配置
        // 'react': 'anujs/dist/ReactIE',
        // 'react-dom': 'anujs/dist/ReactIE',
    
        // 如果引用了 prop-types 或 create-react-class
        // 需要添加如下别名
        'prop-types': 'anujs/lib/ReactPropTypes',
        'create-react-class': 'anujs/lib/createClass'
        //如果你在移动端用到了onTouchTap事件
        'react-tap-event-plugin': 'anujs/lib/injectTapEventPlugin',  
   }
},
```

详细用法与示例见  [wiki](https://github.com/RubyLouvre/anu/wiki) 

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
```html
<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width">
    <script type='text/javascript' src="./dist/React.js"></script> 
    <script src="https://cdn.bootcss.com/babel-standalone/6.24.0/babel.js"></script>
    <script  type="text/babel" >
  
    class Select extends React.Component{
        constructor(props){
           super(props)

           this.state = {
               value: props.value
           }
           this.onUpdate = props.onUpdate
           this.onChange = this.onChange.bind(this)
        }
        componentWillReceiveProps(props){
           this.state = { //更新自己
               value: props.value
           }
        }
        onChange(e){//让父组件更新自己
            this.onUpdate(e.target.value)
        }
        render(){
            return <select value={this.state.value} onChange={this.onChange}>
                <option>北京</option>
                <option>南京</option>
                <option>东京</option>
                </select>
        }
    }
    class App extends React.Component{
       constructor(props){
           super(props)
           this.state = {
               value: '南京'
           }
        }
        onUpdate(value){ //让子组件调用这个父组件的方法
             this.setState({
                value: value
            })
        }
        onChange(e){
           this.onUpdate(e.target.value)
 
        }
        render(){
          return  <div><Select onUpdate={this.onUpdate.bind(this)} value={this.state.value} /><input value={this.state.value} onChange={this.onChange.bind(this)} /></div>
        }

    }

window.onload = function () {
   
 ReactDOM.render(<App />,
   document.getElementById('example'))

}
    </script>
</head>

<body>
  
    <div>测试</div>
    <blockquote id='example'></blockquote>

</body>

</html>

```
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

+ [selenium-server-standalone](http://selenium-release.storage.googleapis.com/3.3/selenium-server-standalone-3.3.1.jar)
+ [chromedriver](https://sites.google.com/a/chromium.org/chromedriver/), [more available drivers](http://www.seleniumhq.org/projects/webdriver/)
+ nodejs v6.10.0+
+ karma

cli


```bash
npm install selenium-standalone
selenium-standalone start
# 另开窗口
npm run build
```
或者
//linux32可以改成mac, window

```bash
wget https://chromedriver.storage.googleapis.com/2.29/chromedriver_linux32.zip
unzip chromedriver_linux32.zip
wget http://selenium-release.storage.googleapis.com/3.3/selenium-server-standalone-3.3.1.jar
java -jar selenium-server-standalone-3.3.1.jar
# 另开窗口
npm run build
```

