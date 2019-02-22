import React from '@react';
import './pages/index/index';

import './pages/demo/apis/index';
import './pages/demo/apis/clipboard/index';
import './pages/demo/apis/storage/index';
import './pages/demo/apis/canvas/index';
import './pages/demo/apis/canvas/strokeStyle/index';
import './pages/demo/apis/canvas/textBaseline/index';
import './pages/demo/apis/canvas/rect/index';
import './pages/demo/apis/canvas/fillStyle/index';
import './pages/demo/apis/canvas/arc/index';
import './pages/demo/apis/canvas/globalAlpha/index';
import './pages/demo/apis/route/index';

import './pages/demo/native/index/index';
import './pages/demo/native/button/index';
import './pages/demo/native/checkbox/index';
import './pages/demo/native/input/index';
import './pages/demo/native/slider/index';
import './pages/demo/native/picker/index';
import './pages/demo/native/radio/index';
import './pages/demo/native/textarea/index';
import './pages/demo/native/label/index';
import './pages/demo/native/view/index';
import './pages/demo/native/scrollView/index';
import './pages/demo/native/movableView/index';
import './pages/demo/native/swiper/index';
import './pages/demo/native/audio/index';
import './pages/demo/native/image/index';
import './pages/demo/native/video/index';
import './pages/demo/native/camera/index';

import './pages/demo/syntax/index/index';
import './pages/demo/syntax/stateless/index';
import './pages/demo/syntax/loop/index';
import './pages/demo/syntax/loop2/index';
import './pages/demo/syntax/loop3/index';
import './pages/demo/syntax/loop4/index';
import './pages/demo/syntax/loop5/index';
import './pages/demo/syntax/webview/index';

import './pages/demo/syntax/extend/index';
import './pages/demo/syntax/inlineStyle/index';
import './pages/demo/syntax/if/index';
import './pages/demo/syntax/ifcom/index';
import './pages/demo/syntax/children/index';
import './pages/demo/syntax/await/index';
import './pages/demo/syntax/multiple/index';
import './pages/demo/syntax/request/index';

import './pages/demo/ticketSearch/index';
import './pages/demo/calendar/index';
import './pages/demo/boat/index';
import './pages/demo/scenic/index';
import './pages/demo/strategy/index';
import './pages/demo/userCenter/index';
import './pages/demo/question/index/index';
import './pages/demo/question/detail/index';
import './pages/demo/cardList/index';
import './pages/demo/citySelect/index';

import './pages/about/index';

import './app.scss';

class Global extends React.Component {
    config = {
        window: {
            backgroundTextStyle: 'light',
            // navigationBarBackgroundColor: '#0088a4',
            navigationBarTitleText: 'mpreact',
            navigationBarTextStyle: '#fff'
        },
        tabBar: {
            color: '#929292',
            selectedColor: '#00bcd4',
            borderStyle: 'black',
            backgroundColor: '#ffffff',
            list: [
                {
                    pagePath: 'pages/index/index',
                    iconPath: 'assets/image/homepage_normal.png',
                    selectedIconPath: 'assets/image/homepage_select.png',
                    text: '首页',
                    name: 'Home',
                    selected: true
                },
                {
                    pagePath: 'pages/demo/question/index/index',
                    iconPath: 'assets/image/question_normal.png',
                    selectedIconPath: 'assets/image/question_select.png',
                    text: '问答社区',
                    name: 'questionAndAnswer'
                },
                {
                    pagePath: 'pages/demo/userCenter/index',
                    iconPath: 'assets/image/uc_normal.png',
                    selectedIconPath: 'assets/image/uc_select.png',
                    text: '我的',
                    name: 'My'
                }
            ]
        }
    };
    onCollectLogs(dataset, type, node) {
        var page = React.getCurrentPage();
        if (!page) {
            return;
        }
        var path = page.props.path;
        var uuid = dataset.beaconUid;
        if (node) {
            var xpath = [];
            while (node.parentNode) {
                var index = node.parentNode.children.indexOf(node);
                xpath.unshift(index);
                node = node.parentNode;
            }
            uuid = xpath.join('/');
        }
        console.log("收集日志", path, type, uuid); //eslint-disable-line
    }
    globalData = {
        ufo: 'ufo'
    };
    onGlobalShow() {
        console.log(React.getCurrentPage().props.path, 'onGlobalShow');//eslint-disable-line
    }
    onGlobalLoad() {
        let ANU_ENV = process.env.ANU_ENV;//wx ali bu quick
        if (ANU_ENV === 'quick') {
            React.api.initStorageSync(this.globalData.__storage);
        }
        
    }
    onLaunch() {
        //针对快应用的全局getApp补丁
        if (this.$data && typeof global === 'object') {
            var ref = Object.getPrototypeOf(global) || global;
            var _this = this;
            ref.getApp = function() {
                return _this;
            };
            this.globalData = this.$def.globalData;
           
        }
        console.log('App launched');//eslint-disable-line
    }
}
//这样写相当于为每一个页面组件的外面都加上一个<Provider />，如果你想在页面上用到store里的数据，
//需要用react-redux的connect方法包一下，详见pages/demo/syntax/redux
// React.applyAppStore(store);
// eslint-disable-next-line
export default App(new Global());
