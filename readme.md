#anu

读作 安努 ，苏美尔的主神，开天辟地。一个无痛使用React与JSX的迷你React框架

随着浏览器的升级，es6,es7的新语法会被完全支持，但JSX是一种自造的语法糖，因此我们不得不依赖于babel 进行编译。这对小公司来说，
可能没有人员能玩转这东西。加之React也太大了，因此我推出了anu。它支持React 95％的功能。剩余功能以后以插件形式慢慢补充上


Read the anu, the god of the Sumerian.

A painless to use the React with JSX mini React frameworkAs the browser upgrade, es6, es7 of neologisms can be fully support, but the JSX is a kind of built of the syntactic sugar, so we have to rely on the Babel to compile.For small companies, this may not have the staff can win this thing.Combined with the React too big, so I introduced, anu.It supports the React function of 95%.In the form of a plug-in added slowly after remaining function

More usage and examples Please see the wiki

https://github.com/RubyLouvre/anu/wiki

###目前没有支持的方法与对象

1. PropTypes
2. childContextTypes
3. Children的方法集合
4. mixin机制

###低版本浏览器可能需要以下 语言补丁

1. Array.isArray
2. Object.assign
3. JSON.stringify

###依赖 jsx-parser与evalJSX

```html
<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width">
    <script src='./dist/jsx-parser.js'></script>
    <script src='./dist/evalJSX.js'></script>
    <script src='./dist/anu.js'></script>
    <script>
        class Hello extends anu.Component {
            constructor() {
                super() //Must write, or throw ReferenceError: |this| used uninitialized in Hello class constructor
                this.handleClick = this.handleClick.bind(this)
            }
            componentWillMount() {
                console.log('准备插入DOM树')
            }
            componentDidMount() {
                console.log('已经插入DOM树')
            }
            handleClick() {
                this.setState({
                    title: new Date - 0,
                    child: new Date - 1
                })
            }
            static className() {
                return 'Point';
            }
            render() {
                return evalJSX(`<div tilte={this.state.title} onClick={this.handleClick} >{this.state.child || "点我"}</div>`, {
                    this: this
                })
            }
        }

        function main() {
            return evalJSX(`<h2>对象使用anu<br /><Hello /></h2>`, {
                Hello: Hello
            })
        }
        window.onload = function() {
            var result = anu.render(main(), document.body)
            console.log(result)
        }
    </script>
</head>

<body>
    <div>这个默认会被清掉</div>
</body>

</html>
```

数组的定义方式 
```javascript
 class Hello extends anu.Component {
    render() {
        return 1984
    }
}
```
套嵌的组件

```javascript
class World extends anu.Component {
    render() {
        return 'world'
    }
}
class Hello extends anu.Component {
    render() {
        return World
    }
}
window.onload = function() {
    var result = anu.render(Hello, document.body)
    console.log(result)
}
```

Stateless functional components 
```javascript
 function HelloComponent(props /* context */ ) {
    return evalJSX(`<div>Hello {props.name}</div>`, {
        props: props
    })
}
window.onload = function() {
    var result = anu.render(evalJSX(`<HelloComponent name={222}>`, {
        HelloComponent: HelloComponent
    }), document.body)

    console.log(result)
}
```
