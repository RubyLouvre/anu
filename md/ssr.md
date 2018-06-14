##服务端渲染

###准备动作

 1、安装nodejs与安装express

　　安装nodejs教程:http://www.cnblogs.com/pigtail/archive/2013/01/08/2850486.html

　　安装express教程:http://www.expressjs.com.cn/starter/installing.html

 2、安装node-jsx（使nodejs支持jsx语法）

　　$ npm install node-jsx

 3、安装ejs模板引擎

　　$ npm install ejs

在项目中建立一个app.js，输入
```javascript
var express = require('express');
var app = express();

app.get('/', function (req, res) {
  res.send('Hello World!');
});

var server = app.listen(3000, function () {
    console.log("请在浏览器访问：http://localhost:3000/");
});
```

通过如下命令启动此应用：
```
$ node app.js
```
打开浏览器，输入localhost:3000就看到效果了。

使用模板引擎，我们在建立一个test目录，里面再建一个views目录，模块文件都放里面。
```javascript
var express = require("express");
var app = express();

//指定模板引擎
app.set("view engine", 'ejs');
//指定模板位置
app.set('views', __dirname + '/test/views');

//利用模板文件home.ejs渲染为html
app.get("/", function(req, res) {
    res.render('home.ejs', {
        name: '司徒正美'
    });
});

var server = app.listen(3000, function() {
    console.log("请在浏览器访问：http://localhost:3000/");
});
```
然后我们模块home.ejs
```html
<html>
<head>
<title>my ejs template</title>
</head>

<body>
    <p>Hi <%= name %></p>
</body>
</html>
```
如果你嫌弃ejs后缀文件，你的编辑器无法别识（没有语法高亮），可以改进一下，将home.ejs改为home.html
```javascript
var express = require("express");
var app = express();

//指定模板引擎
var ejs = require('ejs');
app.set("view engine", 'ejs');
//指定模板位置
app.set('views', __dirname + '/test/views');
//使用ejs模板引擎解析html视图文件
app.engine('.html',ejs.__express);   

//利用模板文件home.ejs渲染为html
app.get("/", function(req, res) {
    res.render('home.html', {//这里指定文件名
        name: '司徒正美'
    });
});

var server = app.listen(3000, function() {
    console.log("请在浏览器访问：http://localhost:3000/");
});
```
我们先看一下官方react15.3如何实现后端渲染的
```
npm install react
npm install react-dom
```
在Test目录下建立一个components目录，里面建一个Test.js，表示这里是一个类
```javascript
var React=require("react");
class Test extends React.Component{
      render(){
          return <h1>{this.props.name}</h1>;
      }
  }
 module.exports =  Test
```
然后修改app.js

```javascript
var express = require("express");
var app = express();

//指定模板引擎
var ejs = require('ejs');
app.set("view engine", 'ejs');
//指定模板位置
app.set('views', __dirname + '/test/views');
//使用ejs模板引擎解析html视图文件
app.engine('.html',ejs.__express);  

//................

//安装"node-jsx"，安装该模块可以使nodejs兼容jsx语法
require("node-jsx").install()


var React = global.React = require("react");
var ReactDOMServer = require('react-dom/server')
var Test = require('./test/component/Test.js') //引入React组件
  
//利用模板文件home.ejs渲染为html
app.get("/", function(req, res) {
    res.render('home.html', {//这里指定文件名
        component: ReactDOMServer.renderToString( React.createElement( Test,{name:"司徒正美"}) )
    })
})
//................

var server = app.listen(3000, function() {
    console.log("请在浏览器访问：http://localhost:3000/");
});
```
然后将模板改一下
```html
<html>

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width">
    <title>react 后端渲染</title>
</head>

<body>
    <div id="container">
        <%-component%>
    </div>
    <!--使用ejs模板解析后的html字符串-->
</body>

</html>
```
如果想使用anu的后端渲染方案，主要改一下链接就是

```javascript
var express = require("express");
var app = express();

//指定模板引擎
var ejs = require('ejs');
app.set("view engine", 'ejs');
//指定模板位置
app.set('views', __dirname + '/test/views');
//使用ejs模板引擎解析html视图文件
app.engine('.html',ejs.__express);  


//................

//安装"node-jsx"，安装该模块可以使nodejs兼容jsx语法
require("node-jsx").install()


var React = global.React = require("./dist/React");
//var ReactDOMServer = require('react-dom/server')
var ReactDOMServer = require('./dist/ReactDOMServer')

var Test = require('./test/components/Test.js') //引入React组件
//利用模板文件home.ejs渲染为html

app.get("/", function(req, res) {
    res.render('home.html', {//这里指定文件名
        component: ReactDOMServer.renderToString( React.createElement( Test,{name:"司徒正美"}) )
    })
})
//................


var server = app.listen(3000, function() {
    console.log("请在浏览器访问：http://localhost:3000/");
});
```

但现在前端是一个静态页面，没有JS ，我们让它能活动起来
设置一下静态资态的目录，我把React.js, babel.js什么放到这里上
```javascript
//app.js
app.use(express.static('dist'));
```

重写一下Test目录，让它有事件
```javascript
var React=require("../../dist/React");
class Test extends React.Component{
      click(){
          console.log('=========')
      }
      render(){
          return <h1>{this.props.name}
          <p onClick={this.click.bind(this)}>事件</p>
          </h1>;
      }
  }
 module.exports =  Test
```
home.html也改一下
```html
<html>

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width">
    <title>react 后端渲染</title>
    <script src='React.js'></script>
      <script src='babel.js'></script>
       <script type='text/babel'>

 class Test extends React.Component{
      click(){
          console.log('=========')
      }
      render(){
          return <h1>{this.props.name}
          <p onClick={this.click.bind(this)}>事件</p>
          </h1>;
      }
  }
  window.onload = function(){
      ReactDOM.render(<Test name='司徒正美' />, document.getElementById('container'))
  }
      </script>
</head>

<body>
    <div id="container">
        <%-component%>
    </div>
    <!--使用ejs模板解析后的html字符串-->
</body>

</html>
```
这个后端渲染与前端渲染有什么区别呢？后端渲染会为你的根组件生成的标签添加两个属性`data-reactroot`与 `data-react-checksum`。其中后者是为了兼容官网React，anu只需要前者就行了。在前端的ReactDOM.render方法里面，anu会检测插入位置的所有直接孩子，判定它有没有`data-reactroot`属性，有则进入对齐模式。对齐模式与传统的创建模式不一样。

创建模式是根据虚拟DOM创建一棵真实DOM树，然后移除原容器的所有孩子，插入其中。

对齐模式是因为后端已经将所有孩子直接创建好，但可能会多出一些文本节点。这时它只根据虚拟DOM 的type与真实DOM 的**node.toLowerCase()**进行比较就是。速度肯定快上几个数量级。

而在实际项目中，我们可以通过babel将Test（会去掉里面的`module.export = Test`）及其他代码进行打包，不会直接写在页面上的。这样一来 ,就可以达到前后共享一套代码。

https://cnodejs.org/topic/5660f8f9d0bc14ae27939b37
http://blog.csdn.net/mqy1023/article/details/55051788
http://imweb.io/topic/5547892e73d4069201d83e6c
http://blog.techbridge.cc/2016/08/27/react-redux-immutablejs-node-server-isomorphic-tutorial/
https://blog.coding.net/blog/React-Server-Side-Rendering-for-SPA-SEO