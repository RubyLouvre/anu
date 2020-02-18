# 华为快应用获取页面参数

华为快应用是无法获取页面参数，我们需要给页面添加一个protected对象与public对象。但我们又不可能每个页面都添加这两个对象，
因此我们提供下面的方式给用户获取参数。

在app.js添加两个静态对象innerQuery与outerQuery, innerQuery是用来接受页面间的跳转参数，outerQuery是用来接收外面跳进快应用的参数
（比如H5跳快应用，卡片快应用跳快应用）。这两个参数对象的里面键名不能出现重复，比如innerQuery有a,b, outerQuery只能是c与d,不能加a.

在app.js添加两个静态对象是对所有页面都生效。

内外参数的设置详见[快应用文档](https://doc.quickapp.cn/tutorial/framework/switching-pages-and-passing-parameters.html)

>protected 内定义的属性，允许被应用内部页面请求传递的数据覆盖，不允许被应用外部请求传递的数据覆盖
>若希望参数允许被应用外部请求传递的数据覆盖，请在页面的 ViewModel 的public属性中声明使用的属性

```jsx
class Global extends React.Component {
    globalData = {}
    static config = {
        window: {
            navigationBarBackgroundColor: '#00afc7',
            backgroundTextStyle: 'light',
            navigationBarTitleText: 'nanachi',
            navigationBarTextStyle: 'white'
        }
    };
    static innerQuery = { //这里的值是随意的
      a: 1,
      b: 1
    }
    static outerQuery = { //这里的值是随意的
      c: 1,
      d: 1
    }
}
```

在某个需要获取参数的页面中也可以添加静态对象innerQuery与outerQuery， 它们是对app.js的同名参数对象的一些补充。

```jsx
import React from '@react';
import { GlobalTheme } from '@common/GlobalTheme/index'; //@common 别名在package.json中配置
import Layout from '@components/Layout/index';
import AnotherComponent from '@components/AnotherComponent/index';
import './index.scss';
class P extends React.Component {
    state = {
        anyVar: { color: 'red' }
    };
    static innerQuery = {
       k: 1
    }
    componentDidMount() {
        // eslint-disable-next-line
        console.log('page did mount!', this.props.query);
        //由于我们在app.js指定了要获取a,b参数，在页面又指定获取c参数，因此这对象里面有a,b,c三个key
    }
    render() {
        console.log(this.state.anyVar, '!!')
        return (<div class="page" >
            <GlobalTheme.Provider value={this.state.anyVar} >
                <Layout>
                    <AnotherComponent />
                </Layout>
            </GlobalTheme.Provider>
        </div>
        );
    }
}

export default P;
```

public, protected, innerQuery, outerQuery的关系详见源码

```javascript
export function registerPage(PageClass, path) {
    var def = _getApp().$def
    var appInner = def.innerQuery;
    var appOuter = def.outerQuery;
    var pageInner = PageClass.innerQuery;
    var pageOuter = PageClass.outerQuery;
    
    var innerQuery = pageInner ?  Object.assign({}, appInner, pageInner ): appInner;
    var outerQuery = pageOuter ?  Object.assign({}, appOuter, pageOuter ): appOuter;
    let config = {
        private: {
            props: Object,
            context: Object,
            state: Object
        },
        //华为快应用拿不到页面参数，在$page.uri拿不到，manifest.json加了filter也不行
        protected: innerQuery, //页面间的参数
        public: outerQuery,    //外面传过来的参数
        dispatchEvent,
        onInit() { },
        onReady: onReady,
        onDestroy: onUnload
    }
    return config
}
```