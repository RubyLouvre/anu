# 动画

## createAnimation(Object object)

创建一个动画实例 animation。调用实例的方法来描述动画。最后通过动画实例的 export 方法导出动画数据传递给组件的 animation 属性。

> React.api.createAnimation 不支持快应用。快应用既没有提供获取元素长宽位置信息的API，也没有修改元素长宽位置的能力

**OBJECT 参数说明：**

| 属性     | 类型         | 默认值  | 是否必须 | 说明                                             | 支持平台 |
| -------- | ------------ | ------- | -------- | ------------------------------------------------ | -------- |
| duration | number |    400     | 否       | 动画持续时间，单位 ms                 | 都支持   |
| timingFunction | string       | 'linear' | 否       | 动画的效果                                   | 微信,支付宝     |
| delay  | number     |   0      | 否       | 动画延迟时间，单位 ms                           | 都支持   |
| transformOrigin    | string     | 百度为‘50% 50% 0’        | 否       | 设置transform-origin                           | 都支持   |


**timingFunction 的合法值：**


| 值 | 说明 | 
| ---- | --- |
| 'linear' | 动画从头到尾的速度是相同的 |
| 'ease' | 动画以低速开始，然后加快，在结束前变慢 |
| 'ease-in' | 动画以低速开始 |
| 'ease-in-out' | 动画以低速开始和结束 |
| 'ease-out' | 动画以低速结束 |
| 'step-start' | 动画第一帧就跳至结束状态直到结束 |
| 'step-end' | 动画一直保持开始状态，最后一帧跳到结束状态 |



## animation

样式：

| 方法 | 参数 | 说明| 
| ---- | --- | ----|
| opacity | value | 透明度，参数范围 0~1|
| backgroundColor | color | 颜色值|
| width | length | 如果传入 number 则默认使用 px，可传入其他自定义单位的长度值 |
| height | length | 同上 |
| top | length | 同上 |
| left | length | 同上 |
| bottom | length | 同上 |
| right | length | 同上 |


旋转：

| 方法 | 参数 | 说明| 
| ---- | --- | ----|
| rotate | deg | deg 范围 -180 ~ 180，从原点顺时针旋转一个 deg 角度 |
| rotateX | deg | deg 范围 -180 ~ 180，在 X 轴旋转一个 deg 角度 |
| rotateY | deg | deg 范围 -180 ~ 180，在 Y 轴旋转一个 deg 角度 |
| rotateZ | deg | deg 范围 -180 ~ 180，在 Z 轴旋转一个deg角度 |
| rotate3d | (x, y , z, deg) | 同 transform-function rotate3d。 |


缩放：

| 方法 | 参数 | 说明| 
| ---- | --- | ----|
| scale | sx,[sy] | 只有一个参数时，表示在 X 轴、Y 轴同时缩放 sx 倍；两个参数时表示在 X 轴缩放 sx 倍，在 Y 轴缩放 sy 倍 |
| scaleX | sx | 在 X 轴缩放 sx 倍 |
| scaleY | sy | 在 Y 轴缩放 sy 倍 |
| scaleZ | sz | 在 Z 轴缩放 sy 倍 |
| scale3d | (sx,sy,sz) | 在 X 轴缩放 sx 倍，在 Y 轴缩放sy 倍，在 Z 轴缩放 sz 倍 |


偏移：

| 方法 | 参数 | 说明| 
| ---- | --- | ----|
| translate | tx,[ty] | 只有一个参数时，表示在 X 轴偏移 tx；两个参数时，表示在 X 轴偏移 tx，在 Y 轴偏移 ty，单位均为 px。 |
| translateX | tx | 在 X 轴偏移 tx，单位 px |
| translateY | ty | 在 Y 轴偏移 tx，单位 px |
| translateZ | tz | 在 Z 轴偏移 tx，单位 px |
| translate3d | (tx,ty,tz) | 在 X 轴偏移 tx，在 Y 轴偏移t y，在Z轴偏移 tz，单位 px |

倾斜：

| 方法 | 参数 | 说明| 
| ---- | --- | ----|
| skew | ax,[ay] | 参数范围 -180 ~ 180。只有一个参数时，Y 轴坐标不变，X 轴坐标延顺时针倾斜 ax 度；两个参数时，分别在 X 轴倾斜 ax 度，在 Y 轴倾斜 ay 度 |
| skewX | ax | 参数范围 -180 ~ 180。Y 轴坐标不变，X 轴坐标延顺时针倾斜 ax度 |
| skewY | ay | 在参数范围 -180~180。X 轴坐标不变，Y 轴坐标延顺时针倾斜 ay 度 |


矩阵变形:

| 方法 | 参数 | 说明| 
| ---- | --- | ----|
| matrix | (a,b,c,d,tx,ty) | <a target="_blank" href="https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/matrix"> 同transform-function matrix </a>|
| matrix3d | ax | <a target="_blank" href="https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/matrix3d"> 同transform-function matrix3d </a> |


## 动画队列 

调用动画操作方法后需要要调用 step() 来表示一组动画完成，在一组动画中可以调用任意多个动画方法，一组动画中的所有动画会同时开始，当一组动画完成后才会进行下一组动画。step() 可以传入一个跟 my.createAnimation() 一样的配置参数用于指定当前组动画的配置。


### Animation.step(Object object)

**OBJECT 参数说明：**

| 属性     | 类型         | 默认值  | 是否必须 | 说明                                             | 支持平台 |
| -------- | ------------ | ------- | -------- | ------------------------------------------------ | -------- |
| duration | number |    400     | 否       | 动画持续时间，单位 ms                 | 都支持   |
| timingFunction | string       | 'linear' | 否       | 动画的效果                                   | 微信     |
| delay  | number     |   0      | 否       | 动画延迟时间，单位 ms                           | 都支持   |
| transformOrigin    | string     |         | 否       | 接口调用失败的回调函数                           | 都支持   |
| complete | function     |   50% 50% 0      | 否       | 设置transform-origin | 都支持   |


**timingFunction 的合法值：**


| 值 | 说明 | 
| ---- | --- |
| 'linear' | 动画从头到尾的速度是相同的 |
| 'ease' | 动画以低速开始，然后加快，在结束前变慢 |
| 'ease-in' | 动画以低速开始 |
| 'ease-in-out' | 动画以低速开始和结束 |
| 'ease-out' | 动画以低速结束 |
| 'step-start' | 动画第一帧就跳至结束状态直到结束 |
| 'step-end' | 动画一直保持开始状态，最后一帧跳到结束状态 |

```html
<div>
    <button onTap={this.animation} animation={this.state.animation}>showModal</button>
</div>
```

```javascript
    var animation = React.api.createAnimation();
    animation.rotate(90).translateY(10).step();
    animation.rotate(-90).translateY(-10).step();
        this.setState({
            animation: animation.export()
        });
```