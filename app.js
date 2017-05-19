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
