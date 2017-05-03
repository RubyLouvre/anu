# anu

读作 安努 ，苏美尔的主神，开天辟地。一个无痛使用React与JSX的迷你React框架

随着浏览器的升级，es6,es7的新语法会被完全支持，但JSX是一种自造的语法糖，因此我们不得不依赖于babel 进行编译。这对小公司来说，
可能没有人员能玩转这东西。加之React也太大了，因此我推出了anu。它支持React 95％的功能。剩余功能以后以插件形式慢慢补充上


Read as anu, which is the god of the Sumerian.

A painless mini React framework to use the React with JSX.

As browsers keep upgrading, the new grammer of es6, es7 will be fully supported. But the JSX is a grammer sugar that we have to rely on the Babel to compile it. Small companies may not have staffs that can win this thing. Besides the React framework is too big, that's why I introduced anu. It supports 95% functionalily of React and other remaining functionalities will be added as plugin.

More usage and examples please see the wiki

https://github.com/RubyLouvre/anu/wiki

### 目前没有支持的方法与对象

1. PropTypes
2. childContextTypes(不需要定义它，就能使用context)
3. Children的方法集合
4. mixin机制
5. createClass

### 低版本浏览器可能需要以下 语言补丁

1. [Array.isArray](https://github.com/juliangruber/isarray/blob/master/index.js)
2. [Object.assign](https://github.com/ryanhefner/Object.assign/blob/master/index.js)
3. [JSON.stringify](https://github.com/flowersinthesand/stringifyJSON)
4. [console-polyfill](https://github.com/paulmillr/console-polyfill) 

或者直接使用**polyfill.js** https://github.com/RubyLouvre/anu/tree/master/dist/polyfill.js



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
支持React的无狀态组件，纯组件，高阶组件，受控组件与非受控组件，




### 测试 

依赖于

+ [selenium-server-standalone](http://selenium-release.storage.googleapis.com/3.3/selenium-server-standalone-3.3.1.jar)
+ [chromedriver](https://sites.google.com/a/chromium.org/chromedriver/), [more available drivers](http://www.seleniumhq.org/projects/webdriver/)
+ nodejs v6.10.0+
+ karma

cli

```
    // start selenium-server-standalone
    java -jar selenium-server-standalone-3.3.1.jar
    // start karma server && event-driver server
    node node_modules/karma-event-driver-ext
    // or 
    ./node_modules/.bin/karma-event-driver-ext
```


