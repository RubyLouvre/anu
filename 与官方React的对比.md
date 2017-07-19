## 顶层API 对照表


> preact(-compat) 是指preact+ peact-compat

| 名称                                           | 类别            | React | anu    | preact(-compat) |
|----------------------------------------------|---------------|-------|--------|-----------------|
| React.Component                              | class         | ✔️    | ✔️     | ✔️              |
| React.PureComponent                          | class         | ✔️    | ✔️     | ✔️              |
| React.createClass                            | Top-Level API | ✔️    | ✔️     | ✔️              |
| React.createElement                          | Top-Level API | ✔️    | ✔️     | ✔️              |
| React.cloneElement                           | Top-Level API | ✔️    | ✔️     | ✔️              |
| React.createFactory                          | Top-Level API | ✔️    | ✔️     | ✔️              |
| React.isValidElement                         | Top-Level API | ✔️    | ✔️     | ✔️              |
| React.DOM                                    | Top-Level API | ✔️    | ✖️     | ✔️              |
| React.PropTypes                              | Top-Level API | ✔️    | compat | compat          |
| React.Children                               | Top-Level API | ✔️    | ✔️     | ✔️              |
| ReactDOM.render                              | Top-Level API | ✔️    | ✔️     | ✔️              |
| ReactDOM.unmountComponentAtNode              | Top-Level API | ✔️    | ✔️     | ✔️              |
| ReactDOM.unstable_renderSubtreeIntoContainer | Top-Level API | ✔️    | ✔️     | ✔️              |
| ReactDOM.findDOMNode                         | Top-Level API | ✔️    | ✔️     | ✔️              |
| ReactDOMServer.renderToString                | Top-Level API | ✔️    | ✔️     | ✔️              |
| ReactDOMServer.renderToStaticMarkup          | Top-Level API | ✔️    | ✖️     | ✖️              |

其中，createClass，isValidElement，PropTypes，Children，unmountComponentAtNode，unstable_renderSubtreeIntoContainer不建议大家使用了。

## 组件实例API 对照表

| 名称                     | 类别            | React | anu | preact(-compat) |
|------------------------|---------------|-------|-----|-----------------|
| Instance .setState     | Component API | ✔️    | ✔️  | ✔️              |
| Instance .replaceState | Component API | ✔️    | ✖️  | ✔️              |
| Instance .forceUpdate  | Component API | ✔️    | ✔️  | ✔️              |
| Instance .isMounted    | Component API | ✔️    | ✖️  | ✔️              |

## 组件Specs 对照表


| 名称           | 类别        | Specs | React | anu | preact(-compat) |
|--------------|-----------|-------|-------|-----|-----------------|
| render       | Component | Specs | ✔️    | ✔️  | ✔️              |
| state        | Component | Specs | ✔️    | ✔️  | ✔️              |
| defaultProps | Component | Specs | ✔️    | ✔️  | ✔️              |
| propTypes    | Component | Specs | ✔️    | ✔️  | ✔️              |



## 组件生命周期 对照表

| 名称                                    | 类别                 | React | anu | preact(-compat) |
|---------------------------------------|--------------------|-------|-----|-----------------|
| componentWillMount(合并setState)        | Component Lifecyle | ✔️    | ✔️  | ✔️              |
| componentDidMount                     | Component Lifecyle | ✔️    | ✔️  | ✔️              |
| componentWillReceiveProps(合并setState) | Component Lifecyle | ✔️    | ✔️  | ✔️              |
| shouldComponentUpdate                 | Component Lifecyle | ✔️    | ✔️  | ✔️              |
| componentWillUpdate                   | Component Lifecyle | ✔️    | ✔️  | ✔️              |
| componentDidUpdate                    | Component Lifecyle | ✔️    | ✔️  | ✔️              |
| componentWillUnmount                  | Component Lifecyle | ✔️    | ✔️  | ✔️              |

## 特性支持对照

| 名称                      | 类别  | React      | anu    | preact(-compat) |
|-------------------------|-----|------------|--------|-----------------|
| contextTypes            | 特性  | ✔️         | ✔️     | ✔️              |
| getChildContext         | 特性  | ✔️         | compat | compat          |
| ref                     | 特性  | ✔️         | ✔️     | ✔️️             |
| getDOMNode              | 特性  | ✔️         | ✔️     | ✖️              |
| style                   | 特性  | ✔️         | ✔️     | ✖️              |
| onEvent                 | 特性  | ✔️         | ✔️     | ✔️              |
| onEventCapture          | 特性  | ✔️         | ✔️     | ✖️              |
| dangerouslySetInnerHTML | 特性  | ✔️         | ✔️     | ✖️              |
| （非）受控组件                 | 特性  | ✔️         | ✔️     | ✖️              |
| IE8支持                   | 特性  | ✔️（高版本不支持） | ✔️     | ✖️              |

anu提交ReactIE＋polyfill可以兼容到IE6，三方都支持React官方的Chrome DevTools