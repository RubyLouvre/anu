import React from '@react';

import './pages/index/index';

import './pages/my/index';
import './pages/classify/index';
import './pages/cart/index';
import './pages/details/index';
import './pages/brand/index';
import './pages/list/index';

import './app.less';

class Demo extends React.Component {
    static config = {
        window: {
            backgroundTextStyle: 'light',
            navigationBarBackgroundColor: '#0088a4',
            navigationBarTitleText: 'mpreact',
            navigationBarTextStyle: 'white',
            backgroundColor: '#F2F2F2'
        },
        tabBar: {
            color: '#6e6d6b',
            selectedColor: '#f9f027',
            borderStyle: 'white',
            backgroundColor: '#292929',
            list: [
                {
                    pagePath: 'pages/index/index',
                    iconPath: 'assets/images/footer-icon-01.png',
                    selectedIconPath: 'assets/images/footer-icon-01-active.png',
                    text: '微商城'
                },
                {
                    pagePath: 'pages/classify/index',
                    iconPath: 'assets/images/footer-icon-02.png',
                    selectedIconPath: 'assets/images/footer-icon-02-active.png',
                    text: '分类'
                },
                {
                    pagePath: 'pages/cart/index',
                    iconPath: 'assets/images/footer-icon-03.png',
                    selectedIconPath: 'assets/images/footer-icon-03-active.png',
                    text: '购物车'
                },
                {
                    pagePath: 'pages/my/index',
                    iconPath: 'assets/images/footer-icon-04.png',
                    selectedIconPath: 'assets/images/footer-icon-04-active.png',
                    text: '我的'
                }
            ]
        }
    };
    globalData = {
        userInfo: null
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
        console.log('App launched'); //eslint-disable-line
        //调用登录接口
        // React.api.login({
        //     success: function(r) {
        //         if (r.code) {
        //             // eslint-disable-next-line
        //             let code = r.code;
        //             React.api.getUserInfo({
        //                 success: function() {
        //                     // console.log('res', res);
        //                 }
        //             });
        //         }
        //     }
        // });

    }

}

// eslint-disable-next-line
export default App(new Demo());
