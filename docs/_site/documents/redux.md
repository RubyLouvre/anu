# Redux与Mobx的支持

想使用Redux与Mobx，我们需要对app.js添加render方法，返回Provider组件就行了。这样全局就可以共用一个store。其他想用store数据的页面，则需要通过装修器或connect方法，将原来的页面类或组件类包裹成高阶组件export 出来。

具体可通过nanachi init命令初始化相应模板，查看Redux、Mobx示例代码

## Redux

### App组件处理

app.js由于不支持jsx语法，我们需要用React.createElement来创建对应的组件

```javascript
import React from '@react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

//--------[begin]------------
//这部分代码可以独立到一个store.js
const reducer = function (state, action) {
    switch(action.type) {
        case 'ADD': 
            return {
                ...state,
                value: state.value + 1
            };
        case 'MINUS': 
            return {
                ...state,
                value: state.value - 1
            };
        case 'CHANGE': 
            return {
                ...state,
                inputVal: action.payload
            };
        default:
            return state;
    }
}

const initState = {
    value: 12,
    inputVal: 100
}
const store = new createStore(reducer, initState);
//------------[end]--------------
class Global extends React.Component {
    globalData = {
        _GlobalApp: typeof Provider === 'function' ? Global: null //重点, 
    }
    static config = {
        window: {
            navigationBarBackgroundColor: '#00afc7',
            backgroundTextStyle: 'light',
            backgroundColor: '#00afc7',
            navigationBarTitleText: 'nanachi',
            navigationBarTextStyle: 'white'
        }
    };
    onLaunch() {
        //针对快应用的全局getApp补丁
        if (this.$data && typeof global === 'object') {
            var ref = Object.getPrototypeOf(global) || global;
            var _this = this;
            this.globalData = this.$def.globalData;
            ref.getApp = function() {
                return _this;
            };
        }
        console.log('App launched');//eslint-disable-line
    }

}
if(typeof Provider === 'function'){
    // 正常nanachi项目app中不需要render，如需使用状态库Provider，需要添加render方法 
    Global.prototype.render = function() {
      //  var {store} = React.getApp().globalData
        return React.createElement(Provider, {store: store}, this.props.children )
    }
}

export default App(new Global());
```

`globalData._GlobalApp`非常重要，它对应的ReactWX里面的源码

```javascript
   let GlobalApp;
   function _getGlobalApp(app) {
       return GlobalApp || app.globalData._GlobalApp;
    }
    let GlobalApp = _getGlobalApp(app);
    app.$$pageIsReady = false; //pageIsReadyg与delayMounts是专门给快应用
    app.$$page = this;
    app.$$pagePath = path;
    var dom = PageClass.container;
    var pageInstance;
    if (typeof GlobalApp === "function") {//拿到app.js的Global类，目的是注入store
        this.needReRender = true;
        render(
            createElement(
                GlobalApp,
                {},
                createElement(PageClass, {
                    path: path,
                    key: path,
                    query: query,
                    isPageComponent: true
                })
            ),
            dom,
            function() {
                var fiber = get(this).child;
                while (!fiber.stateNode.classUid) {
                    fiber = fiber.child;
                }
                pageInstance = fiber.stateNode;
            }
        );
    } else {
        pageInstance = render(
            //生成页面的React对象
            createElement(PageClass, {
                path: path,
                query: query,
                isPageComponent: true
            }),
            dom
        );
    }
    
```


### Pages/Components组件处理

页面、组件的写法与原生redux基本一致，需要注意不要将connect语句写到export default中，而是要在export default之前调用。

```javascript
import React, {Component} from '@react';
import { connect } from 'react-redux';

const mapStateToProps = function (state) {
    return {
        value: state.value
    }
}

const mapDispatchToProps = function (dispatch) {
    return {
        add: function() {
            dispatch({
                type: 'ADD'
            });
        },
        minus: function() {
            dispatch({
                type: 'MINUS'
            });
        }
    }
}

class P extends Component {
    render() {
        return (<div class="page" >
                <text>{this.props.value}</text>
                <button onClick={()=> {this.props.add()}}>+</button>
                <button onClick={()=> {this.props.minus()}}>-</button>
        </div>
        );
    }
}

// connect需要写到export default语句前包裹页面。
P = connect(mapStateToProps, mapDispatchToProps)(P);

export default P;
```

## Mobx

### App组件处理

与redux处理方式相同

```jsx
import React from '@react';
import { Provider } from 'mobx-react';
import Store from './store/index';
import './pages/index/index';

const store = new Store();

class Global extends React.Component {
    globalData = {}
    static config = {
        window: {
            navigationBarBackgroundColor: '#00afc7',
            backgroundTextStyle: 'light',
            backgroundColor: '#00afc7',
            navigationBarTitleText: 'nanachi',
            navigationBarTextStyle: 'white'
        }
    };
    onLaunch() {
        //针对快应用的全局getApp补丁
        if (this.$data && typeof global === 'object') {
            var ref = Object.getPrototypeOf(global) || global;
            var _this = this;
            this.globalData = this.$def.globalData;
            ref.getApp = function() {
                return _this;
            };
        }
        console.log('App launched');//eslint-disable-line
    }
    render() {
        return React.createElement(Provider, {store: store}, this.props.children )
    }
}
// eslint-disable-next-line
export default App(new Global());

```

### Pages/Components组件处理

与传统mobx装饰器写法一致

> 注意必须使用inject方法

```javascript
import React, {Component} from '@react';
import { observer, inject } from 'mobx-react';

@inject(
    state => ({
        num: state.store.num,
        add: state.store.add,
        minus: state.store.minus
    })
)
@observer
class P extends Component {
    render() {
        return (<div class="page" >
                <text>{this.props.num}</text>
                <button onClick={()=> {this.props.add()}}>+</button>
                <button onClick={()=> {this.props.minus()}}>-</button>
        </div>
        );
    }
}

export default P;
```

>在百度小程序中，如果你使用mobx可能会报一堆错误,说找不到react, react-dom，
那么我们需要在工程的node_modules下建立一个react, react-dom目录，里面只有index.js，内容为ReactBu的代码
或者使用以下方式： https://zhuanlan.zhihu.com/p/90015927

![./redux.png]




