import React from '@react';
import './pages/index/index';

import './pages/demo/syntax/index';

import './app.less';

class Demo extends React.Component {
    config = {
        window: {
            backgroundTextStyle: 'light',
            navigationBarBackgroundColor: '#0088a4',
            navigationBarTitleText: 'mpreact',
            navigationBarTextStyle: '#fff'
        }
    };
    globalData = {
        ufo: 'ufo'
    };
    onLaunch() {
        // eslint-disable-next-line
        console.log('App launched');
    }
    
}
//这样写相当于为每一个页面组件的外面都加上一个<Provider />，如果你想在页面上用到store里的数据，
//需要用react-redux的connect方法包一下，详见pages/demo/syntax/redux
// eslint-disable-next-line
export default App(new Demo());
