# Server Sid Render

## Prepare

 1, install nodejs and install express

Install the nodejs tutorial: http://www.cnblogs.com/pigtail/archive/2013/01/08/2850486.html

Install express tutorial: http://www.expressjs.com.cn/starter/installing.html

 2, install node-jsx (make nodejs support jsx syntax)

$ npm install node-jsx

 3, install ejs template engine

$ npm install ejs

Create an app.js in the project, enter
```javascript
var express = require('express');
var app = express();

app.get('/', function (req, res) {
  res.send('Hello World!');
});

var server = app.listen(3000, function () {
    console.log ("Please visit the browser: http://localhost:3000/");
});
```

Start this application with the following command:

```bash
$ node app.js
```

Open the browser and enter localhost:3000 to see the effect.

Using the template engine, we are creating a test directory, which will build a views directory. The module files are placed inside.

```javascript
var express = require("express");
var app = express();

// specify the template engine
app.set("view engine", 'ejs');
//Specify the template location
app.set('views', __dirname + '/test/views');

// Render as html using the template file home.ejs
app.get("/", function(req, res) {
    res.render('home.ejs', {
        name: 'Situ Zhengmei'
    });
});

var server = app.listen(3000, function() {
    console.log ("Please visit the browser: http://localhost:3000/");
});
```
Then we module home.ejs
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
If you dislike the ejs suffix file, your editor cannot know it (no syntax highlighting), you can improve it, and change home.ejs to home.html
```javascript
var express = require("express");
var app = express();

// specify the template engine
var ejs = require('ejs');
app.set("view engine", 'ejs');
//Specify the template location
app.set('views', __dirname + '/test/views');
// Use ejs template engine to parse html view file
app.engine('.html',ejs.__express);

// Render as html using the template file home.ejs
app.get("/", function(req, res) {
    res.render('home.html', {//specify the file name here
        name: 'Situ Zhengmei'
    });
});

var server = app.listen(3000, function() {
    console.log ("Please visit the browser: http://localhost:3000/");
});
```
Let's take a look at how the official react15.3 implements backend rendering
```
Npm install react
Npm install react-dom
```
Create a components directory in the Test directory, built a Test.js, said this is a class
```javascript
var React=require("react");
class Test extends React.Component{
      render(){
          return <h1>{this.props.name}</h1>;
      }
  }
module.exports = Test
```
Then modify app.js

```javascript
var express = require("express");
var app = express();

// specify the template engine
var ejs = require('ejs');
app.set("view engine", 'ejs');
//Specify the template location
app.set('views', __dirname + '/test/views');
// Use ejs template engine to parse html view file
app.engine('.html',ejs.__express);

//................

// install "node-jsx", install the module can make nodejs compatible jsx syntax
require("node-jsx").install()


var React = global.React = require("react");
var ReactDOMServer = require('react-dom/server')
var Test = require('./test/component/Test.js') // Introduce React component
  
// Render as html using the template file home.ejs
app.get("/", function(req, res) {
    res.render('home.html', {//specify the file name here
        component: ReactDOMServer.renderToString( React.createElement( Test,{name:"Situ Zhengmei"}) )
    })
})
//................

var server = app.listen(3000, function() {
    console.log ("Please visit the browser: http://localhost:3000/");
});
```
Then change the template
```html
<html>

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width">
    <title>react backend rendering</title>
</head>

<body>
    <div id="container">
        <%-component%>
    </div>
    <!-- Use ejs template parsed html string -->
</body>

</html>
```
If you want to use anu's backend rendering scheme, the main change is

```javascript
var express = require("express");
var app = express();

// specify the template engine
var ejs = require('ejs');
app.set("view engine", 'ejs');
//Specify the template location
app.set('views', __dirname + '/test/views');
// Use ejs template engine to parse html view file
app.engine('.html',ejs.__express);


//................

// Install "node-jsx", install the module can make nodejs compatible jsx syntax
require("node-jsx").install()


var React = global.React = require("./dist/React");
//var ReactDOMServer = require('react-dom/server')
var ReactDOMServer = require('./dist/ReactDOMServer')

var Test = require('./test/components/Test.js') // Introduce React component
// Render as html using the template file home.ejs

app.get("/", function(req, res) {
    res.render('home.html', {//specify the file name here
        component: ReactDOMServer.renderToString( React.createElement( Test,{name:"Situ Zhengmei"}) )
    })
})
//................


var server = app.listen(3000, function() {
    console.log ("Please visit the browser: http://localhost:3000/");
});
```

But now the front end is a static page, there is no JS, we let it move
Set static directory, I put React.js, babel.js here
```javascript
//app.js
app.use(express.static('dist'));
```

Rewrite the Test directory to have events
```javascript
var React = require("../../dist/React");
Class Test extends React.Component{
      click(){
          console.log('=========')
      }
      render(){
          return <h1>{this.props.name}
              <p onClick={this.click.bind(this)}>Events</p>
          </h1>;
      }
  }
module.exports = Test
```
**home.html** also changed

```html
<html>

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width">
    <title>react backend rendering</title>
    <script src='React.js'></script>
      <script src='babel.js'></script>
       <script type='text/babel'>

 Class Test extends React.Component{
      click(){
          Console.log('=========')
      }
      render(){
          Return <h1>{this.props.name}
          <p onClick={this.click.bind(this)}>Events</p>
          </h1>;
      }
  }
  window.onload = function(){
      ReactDOM.render(<Test name='Situ Zhengmei' />, document.getElementById('container'))
  }
   </script>
</head>

<body>
    <div id="container">
        <%-component%>
    </div>
    <!-- Use ejs template parsed html string -->
</body>

</html>
```
What is the difference between this back-end rendering and front-end rendering? The back-end rendering will add two attributes `data-reactroot` and `data-react-checksum` to the labels generated by your root component. The latter is for compatibility with the official website React. Anu only needs the former. In the front-end ReactDOM.render method, anu detects all immediate children at the insertion location, determines whether it has the `data-reactroot` attribute, and enters the alignment mode. The alignment mode is different from the traditional creation mode.

The creation mode is to create a real DOM tree based on the virtual DOM, then remove all the children of the original container and insert it.

The alignment mode is because the backend has created all the children directly, but it may have more text nodes. At this point, it only compares the virtual DOM's type with the real DOM's **node.toLowerCase()**. The speed is surely a few orders of magnitude faster.

In the actual project, we can use Babel to package Test (which will remove the module.export = Test) and other code, which will not be directly written on the page. In this way, you can share a set of code before and after.

* Https://cnodejs.org/topic/5660f8f9d0bc14ae27939b37
* Http://blog.csdn.net/mqy1023/article/details/55051788
* Http://imweb.io/topic/5547892e73d4069201d83e6c
*  Http://blog.techbridge.cc/2016/08/27/react-redux-immutablejs-node-server-isomorphic-tutorial/
* https://blog.coding.net/blog/React-Server-Side-Rendering-for-SPA-SEO

