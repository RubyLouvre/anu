##旧式IE的支持

###Polyfill

anu虽然没有用太多高级，但想让它能运行IE6-8,还是需要加许多补丁的，罗列如下：

1. Array.prototype.forEach
2. Function.prototype.bind
3. JSON
4. window.console
5. Object.keys
6. Object.is
7. Object.assign
8. Array.isArray

这些都是整合到**dist/polyfill**中


### React IE专用库

此外，核心库应该由**dist/React.js**改成**dist/ReactIE.js**

它相当于原来的库，多了Map方法补丁与IE 事件补丁。

Map补丁是es6的新数据对象Map的一个补丁，但它只用于anu内部的某个类，没有完全实现es6 Map

IE事件补丁是针对一些不冒泡事件的修复（input, change, submit, focus, blur），及一些特定事件属性的处理(鼠标事件的pageX, pageY, 键盘事件的which, 滚轮事件的wheelDetla)

http://www.cnblogs.com/rubylouvre/p/5080464.html


```javascript
//src/diff.js
var innerMap = window.Map
try {
    var a = document.createComment('')
    var map = new innerMap
    map.set(a, noop)
    if (map.get(a) !== noop) {
        throw '使用自定义Map'
    }

} catch (e) {
    var idN = 1
    innerMap = function () {
        this.map = {}
    }
    function getID(a) {
        if (a.uniqueID) {
            return 'Node' + a.uniqueID
        }
        if (!a.uniqueID) {
            a.uniqueID = "_" + (idN++)
            return 'Node' + a.uniqueID
        }
    }
    innerMap.prototype = {
        get: function (a) {
            var id = getID(a)
            return this.map[id]
        },
        set: function (a, v) {
            var id = getID(a)
            this.map[id] = v
        },
        "delete": function () {
            var id = getID(a)
            delete this.map[id]
        }
    }
}

var instanceMap = new innerMap()
```

###压缩

如果你用到压缩，就需要处理 uglify-js产生问题，因为IE6-8 ,对于**map.delete("ddd")**, **modulex.default**这样的写法会报语法错误
因为关键字不能做属性名与方法名
```javascript
//详见 https://github.com/zuojj/fedlab/issues/5
new webpack.optimize.UglifyJsPlugin({
    compress: {
        properties: false,
        warnings: false
    },
    output: {
        beautify: true,
        quote_keys: true
    },
    mangle: {
        screw_ie8: false
    },
    sourceMap: false
})
```

###例子

当我们在业务线使用时，需要用webpack进行处理

```javascript
const webpack = require("webpack");
const path = require("path");
const fs = require("fs");
var es3ifyPlugin = require('es3ify-webpack-plugin');

module.exports = {
  context: __dirname,
  entry: {
    index9: "./src/index9.js"
  },
  output: {
    path: __dirname + "/dist/",
    filename: "[name].js"
  },
  plugins: [new es3ifyPlugin()],
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: "babel-loader",
        exclude: path.resolve(__dirname, "node_modules")
      }
    ]
  },

  resolve: {
    //如果不使用anu，就可以把这里注释掉
    alias: {
      react: "anujs/dist/ReactIE.js",
      "react-dom": "anujs/dist/ReactIE.js"
    }
  }
};

```


下面示例文件，大家也可以将polyfill与ReactIE 及bable用到的helpers打包一个common.js
```jsx
class Select extends React.Component{
     constructor() {
        super()
        this.state = {
            value: 'bbb'
        }
        this.onChange = this.onChange.bind(this)
    }
    onChange(e){
       console.log(e.target.value)
       this.setState({
           value: e.target.value
       })
    }
    render() {
        return <div><select  value={this.state.value} onChange={this.onChange}>
            <option value='aaa'>aaa</option>
            <option value='bbb'>bbb</option>
            <option value='ccc'>ccc</option>
        </select><p>{this.state.value}</p></div>
    }
}
class Input extends React.Component{
     constructor() {
        super()
        this.state = {
            value: 'input'
        }
        this.onInput = this.onInput.bind(this)
    }
    onInput(e){
       this.setState({
           value: e.target.value
       })
    }
    render() {
        return <div><input value={this.state.value} onInput={this.onInput} />{this.state.value}</div>
    }
}
class Radio extends React.Component{
     constructor(props) {
        super(props)
        this.state = {
            value: this.props.value
        }
        this.onChange = this.onChange.bind(this)
    }
    onChange(e){
        console.log(e.target.value)
       this.setState({
           value: e.target.value
       })
    }
    render() {
        return <span><input type='radio' name={this.props.name} value={this.props.value}  onChange={this.onChange} />{this.state.value+''}</span>
    }
}
class Playground extends React.Component{
     constructor(props) {
        super(props)
        this.state = {
            value: '请上下滚动鼠标滚轮'
        }
        this.onWheel = this.onWheel.bind(this)
    }
    onWheel(e){
       this.setState({
           value: e.wheelDelta
       })
    }
    render() {
        return <div style={{width:300,height:300,backgroundColor:'red',display:'inline-block'}} onWheel={this.onWheel} >{this.state.value}</div>
    }
}
class MouseMove extends React.Component{
     constructor(props) {
        super(props)
        this.state = {
            value: '请在绿色区域移动'
        }
        this.onMouseMove = this.onMouseMove.bind(this)
    }
    onMouseMove(e){
       var v = e.pageX+' '+e.pageY;
       this.setState({
           value: v
       })
    }
    render() {
        return <div style={{width:300,height:300,backgroundColor:'#a9ea00',display:'inline-block'}} onMouseMove={this.onMouseMove} >{this.state.value}</div>
    }
}
class FocusEl extends React.Component{
     constructor(props) {
        super(props)
        this.state = {
            value: '点我'
        }
        this.onFocus = this.onFocus.bind(this)
    }
    onFocus(e){
       console.log(e.target.title)
    }
    render() {
        return <input  title={this.props.title} onKeyUp={(e)=>{console.log(e.which)}} style={{width:100,height:50,backgroundColor:'green',display:'inline-block'}} onFocus={this.onFocus} />
    }
}
window.onload = function(){
    window.s = ReactDOM.render( <div><Select /><Input /><Radio name='sex' value="男" /><Radio name='sex' value='女'/>
    <p><Playground /> <MouseMove /><FocusEl title="aaa" /><FocusEl title="bbb" /></p>
    
    </div>, document.getElementById('example'))
}
```

```html
<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width">
    <style>
        .aaa {
            width: 200px;
            height: 200px;
            background: red;
        }
        .bbb {
            width: 200px;
            height: 200px;
            background: lawngreen;
        }
    </style>
   <script type='text/javascript' src="./dist/polyfill.js"></script>
   <script type='text/javascript' src="./dist/ReactIE.js"></script>
    <script src="./dist/index9.js"></script>
   
</head>

<body>

    <div>这个默认会被清掉</div>
    <div id='example'></div>
</body>
```