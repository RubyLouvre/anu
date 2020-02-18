# 页面参数的获取

小程序与快应用没有location对象，想获取上一个页面跳转后带过来的参数有以下两种方式：

1. onShow(queryObject) 
2. 在React的各种生命周期钩子中访问this.props.query


```jsx
import React from '@react';
import Welcome from '@components/Welcome/index';
import './index.scss';
class P extends React.Component {
    static innerQuery = { // 针对华为快应用的hack
        a: 1,
        b: 1
    }
    componentDidMount() {
        // eslint-disable-next-line
       console.log('page did mount!', this.props.query); //{a:111, b: false}
    }
    onShow(queryObject){
        console.log(queryObject) // {a: 111, b: false}
    }
    render() {
        return (
            <div class='page'>
                <Welcome text='nanachi' />
            </div>
        );
    }
}

export default P;
```

> 快应用分别两大派系， 小米快应用与华为快应用，小米与oppo, vivo, 魅族等公司进行技术共享，华为则自成一派，有自己单独的IDE。

华为快应用是不能直接拿到页面参数，需要我们在app.js与页面上做一些配置，才能拿到参数，详见[这里](./huaweiQuery.md)

nanachi内部获取参数的方式

```javascript

function getQuery(wx, huaweiHack) {
    var page = wx.$page;
    if (page.query) { //小米 1050
        return page.query;
    }
    var query = {};
    if (page.uri) { //小米 1040
        getQueryFromUri(page.uri, query);
        for (var i in query) {
            return query;
        }
    }
    if (huaweiHack && Object.keys(huaweiHack).length) {
        for (var _i in huaweiHack) {
            query[_i] = wx[_i];
        }
        return query;
    }
    var data = _getApp().globalData; //路由跳转前把参数保存在globalData中，跳转后重新拿出来
    return data && data.__quickQuery && data.__quickQuery[page.path] || query;
}

```