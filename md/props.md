## props

props是用来描述组件的外部状态，并且能往下传递的，通常来说，props里面还存在一个children数组，如果不存在子组件，也可以不用写。为了性能起见，props变设计成不可改变，只能在JSX 里使用attributes形式进行定义。

```jsx
class HelloMessage extends React.Component{
  render: function() {
      //这里的props就等于rubylouvre
    return <h1>Hello {this.props.name}</h1>;
  }
}
 
ReactDOM.render(
  <HelloMessage name="rubylouvre" />,
  document.getElementById('example')

```


###默认属性

为了减少最终使用组件的用户的工作量，我们可以在`类名里添加一个对象`，来集中定义**默认属性**。

```html
<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width">
   
    <script src='./dist/React.js'></script>
    <script src="./test/babel.js"></script>
    <script type='text/babel'>
  
       class Parent extends React.Component {
          
            render() {
                return (<HelloComponent name={this.props.name} />)
            }
        }
        Parent.defaultProps = {
            name: '我在这里'
        }
        function HelloComponent(props, context) {
            return (<div>Hello {props.name}</div>)
        }

        window.onload = function() {
            ReactDOM.render(<Parent />, document.getElementById('example'));
        }
    </script>
</head>

<body>
    <div id='example'>这个默认会被清掉</div>
</body>

</html>
```

你也可以使用`静态的访问器属性`

```html
<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width">
   
    <script src='./dist/React.js'></script>
    <script src="./test/babel.js"></script>
    <script type='text/babel'>
  
       class Parent extends React.Component {
            static defaultProps =  {
              name: "静态"
            }
            render() {
                return (<HelloComponent name={this.props.name} />)
            }
        }
       
        function HelloComponent(props, context) {
            return (<div>Hello {props.name}</div>)
        }

        window.onload = function() {
            ReactDOM.render(<Parent />, document.getElementById('example'));
        }
    </script>
</head>

<body>
    <div id='example'>这个默认会被清掉</div>
</body>

</html>

```

如果你安装了bable这个`babel-plugin-transform-class-properties`插件，还可以这样写

[https://www.npmjs.com/package/babel-plugin-transform-class-properties](https://www.npmjs.com/package/babel-plugin-transform-class-properties)

```html

```
<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width">
   
    <script src='./dist/React.js'></script>
    <script src="./test/babel.js"></script>
    <script type='text/babel'>
  
       class Parent extends React.Component {
             static get defaultProps() {
                return {
                    name: "静态"
                }
            }
            render() {
                return (<HelloComponent name={this.props.name} />)
            }
        }
       
        function HelloComponent(props, context) {
            return (<div>Hello {props.name}</div>)
        }

        window.onload = function() {
            ReactDOM.render(<Parent />, document.getElementById('example'));
        }
    </script>
</head>

<body>
    <div id='example'>这个默认会被清掉</div>
</body>

</html>

```
```

###属性验证


在开发环境中，我们可以PropTypes 提供的许多验证器 (validator) 来检查传入数据的有效性。当向 props 传入无效数据时，JavaScript 控制台会抛出警告。下面用例子来说明不同验证器的区别：

```jsx
class Hello extends Component {
	render(){
		return (
			<div> hello { this.props.name } </div>
		);
	}
}
Hello.propTypes ＝ {
    // 可以声明 prop 为指定的 JS 基本类型。默认
    // 情况下，这些 prop 都是可传可不传的。
    optionalArray: React.PropTypes.array,
    optionalBool: React.PropTypes.bool,
    optionalFunc: React.PropTypes.func,
    optionalNumber: React.PropTypes.number,
    optionalObject: React.PropTypes.object,
    optionalString: React.PropTypes.string,

    // 所有可以被渲染的对象：数字，
    // 字符串，DOM 元素或包含这些类型的数组。
    optionalNode: React.PropTypes.node,

    // React 元素
    optionalElement: React.PropTypes.element,

    // 用 JS 的 instanceof 操作符声明 prop 为类的实例。
    optionalMessage: React.PropTypes.instanceOf(Message),

    // 用 enum 来限制 prop 只接受指定的值。
    optionalEnum: React.PropTypes.oneOf(['News', 'Photos']),

    // 指定的多个对象类型中的一个
    optionalUnion: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.number,
      React.PropTypes.instanceOf(Message)
    ]),

    // 指定类型组成的数组
    optionalArrayOf: React.PropTypes.arrayOf(React.PropTypes.number),

    // 指定类型的属性构成的对象
    optionalObjectOf: React.PropTypes.objectOf(React.PropTypes.number),

    // 特定形状参数的对象
    optionalObjectWithShape: React.PropTypes.shape({
      color: React.PropTypes.string,
      fontSize: React.PropTypes.number
    }),

    // 以后任意类型加上 `isRequired` 来使 prop 不可空。
    requiredFunc: React.PropTypes.func.isRequired,

    // 不可空的任意类型
    requiredAny: React.PropTypes.any.isRequired,

    // 自定义验证器。如果验证失败需要返回一个 Error 对象。不要直接
    // 使用 `console.warn` 或抛异常，因为这样 `oneOfType` 会失效。
    customProp: function(props, propName, componentName) {
      if (!/matchme/.test(props[propName])) {
        return new Error('Validation failed!');
      }
    }
  }
```

在React 15.5中，主 React.PropTypes已经被剥离到独立的仓库中。
