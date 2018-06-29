# React转微信小程序的转码器

- [x] 组件的render方法或无状态组件的JSX部分会抽取出来变成wxml文件
- [x] jsx里面支持将`<span>`, `<b>`, `<cite>`， `<div>`, `<h1>`等原本是html的标签转换成`<view>` , `<text>`
- [x] onXXX转换bindxxxx, 如 `onClick={this.onClick}`或`onClick={this.onClick.bind(this)}`转换成`bindtap="onClick"`, 不支持在JSX写一个函数体，即 `onClick={()=>{ console.log(1)}}`
> onTap: "bindtap",
>
> onTouchStart: "bindtouchstart",
>
> onTouchMove: "bindtouchmove",
>
> onTouchCancel: "bindtouchcancel",
>
> onTouchEnd: "bindtouchend",
>
> onLongpress: "bindtongpress",
>
> onLongtap: "bindlongtap",
>
> onTransitionEnd: "bindtransitionend",
>
> onAnimationStart: "bindanimationstart",
>
> onAnimationIteration: "bindanimationiteration",
>
> onAnimationEnd: "bindanimationend",
>
> onTouchForceChange: "bindtouchforcechange",
>
> onClick: "bindtap",
- [x] `style＝{{a:1,b:2,c:3}}` 转换成 `style="a:1; b:2; c: 3"`;
- [x] `{ aaa ? bbb: ccc }` 转换成3个block元素，如`<block><block wx:if="{{aaa}}">bbb</block><block wx:else="true">ccc</block></block>`
- [x] `{ aaa && bbb }` 转换成1个block元素，如`<block wx:if="{{aaa}}">bbb</block>`
- [x] `{ this.props.children }` 转换成`<slot />`
- [x] `{ array.map(function(el, index){}) }` 转换成`<block wx:for="{{arrat}}" wx:for-item="el" wx:for-item="index" >...</block>`
- [x]  if语句里面可以循环与其他if，map语句中可以加if语句与return**子元素的map数组**
- [x] `xxx={ this.vvv }`, `yyy={this.aaa.bbb}` 转换成 `xxx="{{vvv}}"`,`yyy="{{aaa.bbb}}"`
- [x] 类声明转换为小程序式的函数调用，并使用onInit方法劫持constructor，去掉里面的super语句
```javascript
class AAA extends Component {
    constructor(){}
    onClick(){}
}

Component(onInit({
   constructor: function(){},
   onClick: function(){}
}))
```
- [x] 组件的静态属性defaultProps与或类名后面的**defaultProps**自动转换为**properties**对象
- [x] `this.data`转换成`this.state`, `this.setState`转换成`this.setData`

