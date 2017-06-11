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

IE事件补丁是针对一些不冒泡事件的修复

http://www.cnblogs.com/rubylouvre/p/5080464.html

现在只处理oninput, onchange, onsubmit
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

var instanceMap = new Map()
```

```javascript
//src/ieEvent
function dispatchIEEvent(dom, type) {
    try {
        var hackEvent = document.createEventObject()
        hackEvent.__type__ = 'input'
        //IE6-8触发事件必须保证在DOM树中,否则报"SCRIPT16389: 未指明的错误"
        dom.fireEvent("ondatasetchanged", hackEvent)
    } catch (e) {}
}

//Ie6-8 oninput使用propertychange进行冒充，触发一个ondatasetchanged事件
function fixIEInput(dom, name) {
    addEvent(dom, 'propertychange', function (e) {
        if (e.propertyName === 'value') {
            dispatchIEEvent(dom, 'input')
        }
    })
}

function fixIEChange(dom, name) {
    addEvent(dom, 'change', function (e) {
        dispatchIEEvent(dom, 'change')
    })
}

function fixIESubmit(dom, name) {
    if (dom.nodeName === 'FORM') {
        addEvent(dom, 'submit', dispatchEvent)
    }
}


if (msie < 9) {
    eventLowerCache.onInput = 'datasetchanged'
    eventLowerCache.onChange = 'datasetchanged'
    eventLowerCache.onInputCapture = 'datasetchanged'
    eventLowerCache.onChangeCapture = 'datasetchanged'
    eventHooks.onInput = fixIEInput
    eventHooks.onInputCapture = fixIEInput
    eventHooks.onChange = fixIEChange
    eventHooks.onChangeCapture = fixIEChange
    eventHooks.onSubmit = fixIESubmit
}
```

当我们在业务线使用时，需要用webpack进行处理，下面例子是webpack2

```javascript
const webpack = require("webpack");
const path = require("path");
const fs = require("fs");
var es3ifyPlugin = require('es3ify-webpack-plugin');

module.exports = {
  context: __dirname,
  entry: {
     index9: "./src/index9.js" //入口文件
  },
  output: {
    path: __dirname + "/dist/",
    filename: "[name].js"
  },
  plugins: [new es3ifyPlugin()],//注意使用这个es5转es3
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: "babel-loader",
        options: {
          presets: [
            "avalon", "react"
          ],
          "plugins": [
            [
              "transform-es2015-classes", {
                "loose": true
              }
            ]
          ]
        },

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

下面示例文件，大家也可以将polyfill与ReactIE 及bable用到的helpers打包一个common.js

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