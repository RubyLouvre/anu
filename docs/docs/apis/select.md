# 节点查询

## createSelectorQuery

返回一个 SelectorQuery 对象实例。

**入参**

| 参数   | 类型   | 说明                               | 支持平台 |
| ------ | ------ | ---------------------------------- | -------- |
| params | object | 可以指定 page 属性，默认为当前页面 |  支付宝  |

## NodesRef SelectorQuery.select(string selector)

选择当前第一个匹配选择器的节点，选择器支持 id 选择器以及 class 选择器.

返回值
NodesRef

selector 语法
selector 类似于 CSS 的选择器，但仅支持下列语法。

- ID 选择器：#the-id
- class 选择器（可以连续指定多个）：.a-class.another-class
- 子元素选择器：.the-parent > .the-child
- 后代选择器：.the-ancestor .the-descendant
- 跨自定义组件的后代选择器：.the-ancestor >>> .the-descendant
- 多选择器的并集：#a-node, .some-other-nodes

## NodesRef SelectorQuery.selectAll()

在当前页面下选择匹配选择器 selector 的所有节点。

返回值
NodesRef

## NodesRef SelectorQuery.selectViewport()

选择显示区域，可用于获取显示区域的尺寸、滚动位置等信息。

返回值
NodesRef

## SelectQuery NodesRef.boundingClientRect(function callback)

添加节点的布局位置的查询请求，相对于显示区域，以像素为单位。其功能类似于 DOM 的 getBoundingClientRect。

返回 NodesRef 对应的 SelectorQuery。

**参数**

function callback
回调函数，在执行 SelectQuery.exec 方法后，节点信息会在 callbacks 中返回。

**Object res**

| 属性    | 类型   | 说明             |
| ------- | ------ | ---------------- |
| id      | string | 节点的 ID        |
| dataset | Object | 节点的 dataset   |
| left    | number | 节点的左边界坐标 |
| right   | number | 节点的右边界坐标 |
| top     | number | 节点的上边界坐标 |
| bottom  | number | 节点的下边界坐标 |
| width   | number | 节点的宽度       |
| height  | number | 节点的高度       |

## SelectQuery NodesRef.scrollOffset(function callback)

添加节点的滚动位置查询请求，以像素为单位。节点必须是 scroll-view 或者 viewport

**参数**

function callback
回调函数，在执行 SelectQuery.exec 方法后，节点信息会在 callbacks 中返回。

**Object res**

| 属性       | 类型   | 说明               |
| ---------- | ------ | ------------------ |
| id         | string | 节点的 ID          |
| dataset    | Object | 节点的 dataset     |
| scrollLeft | number | 节点的水平滚动位置 |
| scrollTop  | number | 节点的竖直滚动位置 |

返回 NodesRef 对应的 SelectorQuery。

## NodesRef SelectorQuery.exec(function callback)

执行所有的请求，请求结果按请求次序构成数组，在 callback 的第一个参数中返回。

代码示例：

```javascript
componentDidMount() {
    React.api.createSelectorQuery()
      .select('#non-exists').boundingClientRect()
      .select('#one').boundingClientRect()
      .selectAll('.all').boundingClientRect()
      .select('#scroll').scrollOffset()
      .selectViewport().boundingClientRect()
      .selectViewport().scrollOffset().exec((ret) => {
      console.log(JSON.stringify(ret, null, 2));
    });
  }
render() {
    return (
      <div>
        <div className="all">节点 all1</div>

        <div className="all">节点 all2</div>

        <div id="one">节点 one</div>

        <div id="scroll" style="height:200px;overflow: auto">
          <div style="height:400px">独立滚动区域</div>
        </div>
      </div>
    );
  }
```
结果 res：
```
[
  null,
  {
    "x": 1,
    "y": 2,
    "width": 1367,
    "height": 18,
    "top": 2,
    "right": 1368,
    "bottom": 20,
    "left": 1
  },
  [
    {
      "x": 1,
      "y": -34,
      "width": 1367,
      "height": 18,
      "top": -34,
      "right": 1368,
      "bottom": -16,
      "left": 1
    },
    {
      "x": 1,
      "y": -16,
      "width": 1367,
      "height": 18,
      "top": -16,
      "right": 1368,
      "bottom": 2,
      "left": 1
    }
  ],
  {
    "scrollTop": 0,
    "scrollLeft": 0
  },
  {
    "width": 1384,
    "height": 360
  },
  {
    "scrollTop": 35,
    "scrollLeft": 0
  }
]
```
