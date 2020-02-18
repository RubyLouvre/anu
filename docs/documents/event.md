# 事件系统

小程序有两种绑定事件的方式。

- `bindtap` 绑定一个会冒泡的 `tap` 事件
- `catchtap` 绑定一个不会冒泡的 `tap` 事件

```jsx
<view bindtap="eventName" />
```

nanachi 为了大家方便，还是换回大家熟悉的风格，但不能冒泡的限制还没有搞定，因此也是两种绑定风格。

- `onClick` 绑定一个会冒泡的 `click` 事件, 小程序上会自动转换成`tap` 事件
- `catchClick` 绑定一个不会冒泡的 `click` 事件, 小程序上会自动转换成`tap` 事件

```jsx
<div onClick={this.clickHandle.bind(this, 111)} />
```

```jsx
<div onClick={this.clickHandle.bind(this, 111)} />
```

我们的转译器会扫描所有on/catch开头的属性， 进行事件绑定，因此如果你直接用bindTap、bindChange的方式来编写，会导致错误。

```javascript
//转译器中的相关源码
if (/^(?:on|catch)[A-Z]/.test(attrName) &&!/[A-Z]/.test(nodeName) ) {
    //内置标签的nodeName都是小写的，如果它的某个属性以on/catch开头，我们会认为它可能是事件
    var prefix = attrName.charAt(0) == 'o' ? 'on' : 'catch';
    var eventName = attrName.replace(prefix, '');
    var otherEventName = utils.getEventName(
        eventName,
        nodeName,
        buildType
    ）
    //....
}
```

## 映射事件名

有的小程序的原生组件的事件非常坑，你绑定的事件与它触发时的事件对象的type并一致，比如说微信的小程序的map组件

https://developers.weixin.qq.com/miniprogram/dev/component/map.html

它有一个bindregionchange事件，你使用时是这样的`<map onRegionChange={()=>{ console.log(e)}} />`
其实它是不会触发onRegionChange事件，而是触发两种事件，分别为begin与end, 因此我们需要使用data-xxx-alias来映射一下, 为它添加两个属性

`<map onRegionChange={()=>{ console.log(e)}} data-begin-alias="regionchange" data-end-alias="regionchange" />`


## 事件对象

由于小程序存在千差万别的差别，它的事件对象没有像PC有那么多属性与方法，最大的区别是没有`stopPropagation` 与 `preventDefault`。

但娜娜奇会帮你抹平了 PC 与小程序的差异， 为它添加上伪装的 `stopPropagation` 与 `preventDefault()` 方法。

注意 `stopPropagation()` 是没有效果的，你想并且冒泡还需要用 `catchClick` 的方式来绑定事件。

如果 你想它转译成H5，那么catchXXX的回调内部需要大家执行 `e.stopPropagation()`。

小程序事件对象的属性如下：

```jsx
{
    target,//里面有dataset
    pageX,
    pageY,
    value, //不一定有，但input, change事件有
    timeStamp,
    type,
    stopPropagation,
    preventDefault,
    //还可能有其他属性，不同的事件类型会产生额外的属性
}
```
在一些小程序平台中，事件对象有detail这个对象，但建议不要使用它，因为当你想跨平台到webview/H5/快应用时，是没有这个对象的。并且我们也会将这个detail的属性下放到event上。

```javascript
//创建事件对象
function createEvent(e, target) {
    let event = Object.assign({}, e);
    if (e.detail) {
        Object.assign(event, e.detail);
    }
    //需要重写的属性或方法
    event.stopPropagation = function () {
        // eslint-disable-next-line
        console.warn("小程序不支持这方法，请使用catchXXX");
    };
    event.nativeEvent = e;
    event.preventDefault = returnFalse;
    event.target = target;
    event.timeStamp = Date.now();
    let touch = e.touches && e.touches[0];
    if (touch) {
        event.pageX = touch.pageX;
        event.pageY = touch.pageY;
    }
    return event;
}
```
比如说微信小程序的onGetUserInfo方法

```javascript
onGetUserInfo: function(e){
   console.log(e.userInfo)
}
```

## 事件回调

事件回调本身必须定义在类的原型里，不能在视图中使用 `this.props.onClick` ,只能`this.onClick`

## 注意事项

定义了事件的标签，可能会自动添加`data-beacon-uid`, `data-instance-uid`这些属性，注意不要与它们冲突

> 2018.11.14起 定义了事件的标签， 只会添加上data-beacon-uid属性，后面三者不再添加，从而减少视图的体积
> input标签 统一使用onChange事件，不要用onInput
> div标签 统一使用onClick事件，不要用onTap