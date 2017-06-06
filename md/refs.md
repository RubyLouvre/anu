##refs

在组件实例中，存在一个叫refs的对象，在组件render时，框架会将JSX中定义了ref属性的标签对应的DOM节点或实例收集到这个对象。

当ref为一个字符串时，其所在标签的tagName是小写，那么它就会收集其DOM节点，如果标签名是大写开头，那么就会收集其组件实例。

```jsx
class Com extend React.Component{
    render(){
        return <p><input ref="input" /></p>
    }
}

var s = ReactDOM.render(<Com />, document.body)
console.log(s.refs.input) //返回input这个真实DOM
```

此外，ref也可以是一个函数，这时它的传参就是DOM节点或组件实例，它会在组件挂载或卸载时各执行一次，然后在ref对应的函数发生变化时也会执行一次。
在卸载时，传参总是为null

```jsx
function TestComp(props){
    let refDom;
    return (<div>
        <div ref={(node) => refDom = node}>
            ...
        </div>
    </div>)
}
```

值得注意的是，无状态组件由于没有实例，因此不会对 ref进行任何处理。