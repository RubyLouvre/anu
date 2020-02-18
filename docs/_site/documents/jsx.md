# 使用JSX的注意事项

小程序的 `wxml` 只支持 `view`、`text` 与它的那些内置组件标签，娜娜奇可以让你直接使用 `div`, `span`, `p`, `b`, `strong` 等 HTML 标签。块状元素会转换成 `view`, 内联元素会转换为 `text`。

> 你不需要管支付宝小程序支持了哪些标签，快应用支持了哪些标签，你就默认为所有平台都用微信小程序的那一套标签，我们会通过
补丁组件等方式抹平各种小程序的差异。


如果你使用 React 方式定义组件，那么对应的标签名必须以大写开头。

在小程序中，组件不支持包含其他标签，但我们的 React 组件可以充许包含其他标签或组件。

有关for循环，多重循环， if分支, 组件套组件 等用法，可以脚手架的 qunar 示例

为了兼容所有平台，我们定下这些规则

1. 原来打算使用view标签的地方，请使用div,h1这些块状元素代替。
2. 文本必须包含在text, span, a, option, label这几种标签内
3. text标签下面不能出现text标签或span标签，span标签下面不能出现text标签或span标签
4. jsx的属性值里面不能出现反斜扛，不能出现模板字符串
5. jsx中不能出现 声明变量语句，不能出现switch语句
6. jsx中除了onClick这些事件外， 不能出现除map方法外的方法调用
7. 不要在标签内部使用纯空白或通过两边的空白撑开空间，即`<div>  </div`与`<div>  111  </div`,它们会变成 `<div></div`与`<div>111</div`
8. 如果要支持快应用，类似`<div><span>xxx</span></div>`应该改成`<div><text>xxx</text></div>`，因为在快应用下span只能出现在text标签下，不能放在div下面。


## 循环中key的定义

在react中为了提高性能，会用key复用已有节点。但微信小程序的实现不太清楚，它对于要循环的元素都不一样的情况下，使用*this值，
但显然这不是符合react的使用方式。因此我们建议，如果元素是一个对象，那么你就这样使用`<div key={el.title}> </div>`(title为一个字符串或
数值字段，都不一样)，否则就不要定义key

```jsx
<div class="tool-wrapper">
    {this.state.toolData.map(function(item) {
        return (
            <div onTap={this.showTip} class="tool-item" key={item.title} >
                <image class="image" src={item.url} />
                <text class="text">{item.title}</text>
            </div>
        );
    })}
</div>

```
转译成
```html
<view class="tool-wrapper">
    <block wx:for="{{state.toolData}}" wx:for-item="item" wx:for-index="i7391" wx:key="title">
        <view bindtap="dispatchEvent" class="tool-item" data-tap-uid="{{'e204_31_' + i7391}}" data-beacon-uid="default">
            <image class="image" src="{{item.url}}" /><text class="text">{{item.title}}</text></view>
    </block>
</view>
```

## 文本的使用

在要兼容快应用的情况，文本不能直接放在块状元素之下。

错误的用法

```jsx
<Login>
  <p>我是文本</p>
</Login>
```
正确的用法
```jsx
<Login>
   <p><text>我是文本</text></p>
   <p><span>我是文本</span></p>
</Login>
```


## 数据填充的使用

错误的用法
```jsx
<div aaa={this.title}>{this.data.content}</div>
```
正确的用法， 所有数据都只能来自this.props, this.state, this.context
```jsx
<div aaa={this.props.title}>{this.state.content}</div>
```
如果这是一个无状态组件，则这样用
```jsx
function AA(props, context){
   return <div aaa={props.title}>{context.content}</div>
}
```

## 属性值在转译后出现反斜扛的问题

第一个div的类名同时出现双引号与单引号， 修正办法，都用单引号
```jsx
<div class={"recruitment-icon "+ this.state.type+'_bgc'}>
    <div class={"g-q-iconfont icon " + this.state.type}></div>
</div>
```

span的类名同时出现模块字符串与单引号， 修正办法，去掉模板字符串
```jsx
<span
      className={`g-q-iconfont seat-icon ${this.props.hasSelectedSeatsObject[(index + 1) + seat.name] ? 'active' : ''}`}
  >&#xe02d;</span>
```

swiper的duration属性出现非常复杂的字符串拼接，建议在JS里面接好，放到this.state.duration变量中
```jsx
<swiper
    className='banner'
    indicator-dots={this.state.showIndicatorDots}
    indicator-color={this.state.indicatorColor}
    indicator-active-color={this.state.indicatorActiveColor}
    autoplay={this.state.autoplay}
    current={this.state.current}
    interval={this.state.interval}
    duration={
        '"' +
        this.props.duration +
        '\n        circular="' +
        this.props.circular +
        '"\n        vertical="' +
        this.props.vertical +›
        '"\n        previous-margin="' +
        this.props.previousMargin
    }
    next-margin='nextMargin'
    display-multiple-items={1}
    onChange={this.displayIndexChange}
    onAnimationfinish={this.displayAnimationFinish}
>
    <block>
        {this.state.imageUrls.map(function(item, index) {
            return (
                <swiper-item>
                    <image className='banner image' mode='aspectFill' src={item} onTap={this.onTapImage} data-index={index} />
                </swiper-item>
            );
        }, this)}
    </block>
</swiper>
```

## 三元表达式的用法

错误的用法
```jsx
render() {
    return this.state.isOk ? null : <div>Home Page</div>;
  }
```

翻译出的XML会出现 null字样，因为`{{null}}` 会null +"" 变成"null"

```jsx
<block a:if="{{state.isOk}}">{{null}}</block><block a:else="true"><view>Home Page</view></block>
```

正确的用法

三元表达式与&&逻辑语句会转换为block标签，在快应用中，组件的根节点不能为block标签，因此需要包一层

```jsx
render() {
    return <div>{ this.state.isOk ? <div>Home Page</div>: null }<div>
  }
```

翻译出的XML体积还小这么多

```jsx
<div><block a:if="{{state.isOk}}"><view>Home Page</view></block></div>
```

## JSX中不能出现if、switch语句或do表达式

错误的用法

```jsx
render() {
    return if( this.state.isOk ) {
      return <div>Home Page</div>
    } else{
      return "" //null会直接输出null,最好改成空字符串
    }
  }
```
do表达式也不允许

```jsx
// https://babeljs.io/docs/en/babel-plugin-proposal-do-expressions
const Component = props =>
  <div className='myComponent'>
    {do {
      if(color === 'blue') { <BlueComponent/>; }
      else if(color === 'red') { <RedComponent/>; }
      else if(color === 'green') { <GreenComponent/>; }
    }}
  </div>
```

如果真的遇上这么复杂的分支判定，可以使用三元套三元

```jsx
// https://babeljs.io/docs/en/babel-plugin-proposal-do-expressions
const Component = props =>
  <div className='myComponent'>
    {   color === 'blue' ？ <BlueComponent/> : (
        color === 'red' ?  <RedComponent/> :  (
        color === 'green' ? <GreenComponent/>: ""
         ))
    }
  </div>
```

## 方法调用

下面用法出错

```jsx
<div>{Object.keys(this.props.list).map(function(el){
   return <p>{el}--{this.props.list[el]}</p>
})}
</div>
```

```jsx
<div>{this.state.getOrderList()}</div>
<input value={this.state.value.trim()}>

```


## 事件绑定的使用

错误的用法
```jsx
<div onTap={this.props.fn}>点我</div>
```

正确的用法， 事件必须直接以this开头，来源于实例

```jsx
<div onTap={this.fn}>点我</div>
```

## map方法必须将this往里面传递, map的第一个参数不要用箭头函数

```jsx
<ul>{
this.state.list.map(function(el, index){
   return <li onClick={this.click1.bind(el, index)}>{el.name}</li>
},this)
}</ul>
```

## render的使用

错误的用法

```jsx
class A extends React.Component{
  render(){
    var a = this.props
    return <div aaa={a.title}>{a.content}</div>
  }
}
```

正确的用法

```jsx
class A extends React.Component{
  render(){
    return <div aaa={this.props.title}>{this.props.content}</div>
  }
}
```

在早期的百度小程序中s-for指令不支持数组字面量，1.14.13已经修复

```jsx
class A extends React.Component{
  render(){
    return <div>{ 
       [111,222,333].map(function(el){
          return <p>{el}</p>
       })
    }</div>
  }
}
```