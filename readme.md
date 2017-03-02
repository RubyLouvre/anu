#anu
=====

读作 安努 ，苏美尔的主神，开天辟地。

```html
<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width">
    <script src='./dist/anu.js'></script>
    <script>
        var h = anu.createElement
        class Hello extends anu.Component {
            constructor() {
                super() //Must write, or throw ReferenceError: |this| used uninitialized in Hello class constructor
                this.handleClick = this.handleClick.bind(this)
            }
            componentWillMount() {
                console.log('准备插入DOM树')
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
                return h('div', {
                    title: this.state.title,
                    onClick: this.handleClick
                }, this.state.child || "x")
            }
        }

        function main() {
            return h('h2', null, 'A', '你好', h(Hello), h('p'))
        }
        window.onload = function() {
            //render4个参数， vnode, container, callback, clearContainer
            var result = anu.render(main(), document.body, null, false)
            console.log(result)
        }
    </script>
</head>

<body>
    <div>这个默认会被清掉</div>
</body>

</html>
```

