##组件

自从chrome推出web component后，将组件实现标签化的思潮又一次回到我们眼前。上一次是JSP时代。

React/anu中使用组件非常简单，就是将标签名改成类名就行了。

React也经过几次迭代，定义组件的方式改成es6的class来定义组件，只要求它继续React.Component类及添加一个render方法就行了。但这个也不是必须的，因为后来出现了无状态组件。让我们梳理一下React定义组件的三种方式吧，分别有
有状态组件，纯组件，无状态组件。


###1.有状态组件

```javascript
class Input extends React.Component{
   constructor(props){
       super(props)
       this.state = {
           value: 'xxx'
       }
       this.onChange = this.onChange.bind(this)
   }
   onChange(e){
       this.setState(
           value: e.target.value
       )
   }
   render(){
       return <input value={this.state.value} onChange={this.onChange} />
   }
}
ReactDOM.render(<Input />, rootElement)

```

###2.纯组件
纯数组与有状态组件唯一不同就是其父类。父类为它指定了特殊的shouldComponentUpdate。当用户调用了setState，或父组件发生render操作时，子组件也会发生render操作，这时我们可以指定shouldComponentUpdate方法，通过返回false阻止此组件进行更新。

为了减少无效的更新操作，shouldComponentUpdate的实现是非常关键的，因此在早期React版本中有一个叫PureRenderMixin插件非常受欢迎。返回此组件就整合到React中，诞生了现在的纯组件。


```javascript
class Input extends React.PureComponent{
   constructor(props){
       super(props)
       this.state = {
           value: 'xxx'
       }
       this.onChange = this.onChange.bind(this)
   }
   onChange(e){
       this.setState(
           value: e.target.value
       )
   }
   render(){
       return <input value={this.state.value} onChange={this.onChange} />
   }
}
ReactDOM.render(<Input />, rootElement)

```

###3.无状态组件

一个数组是总继承什么父类，必须消耗许多性能，并且在组件挂载到DOM树或更新过程中，会触发一系列生命周期钩子，这也会消耗性能。为了避开所有这一切的性能损失，于是React推出了无状态组件。无状态组就是一个普通的函数，特殊之处是函数的第一个字母大写，接受两个参数(props与context)，返回JSX。


```javascript
function Input (props, context){
       return <input value={props.value} onChange={props.onChange} />
}
ReactDOM.render(<Input />, rootElement)

```

###组件的属性与方法

当我们继承React.Component或React.PureComponent时，会获得一些对象与方法。首先是4个对象，props, state, context, refs与一些改变组件状态的方法，setState, forceUpdate及生命周期钩子。


