import React from '@react';
import './pages/index/index';


import './pages/demo/base/index';

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

import './pages/demo/syntax/index';
import './pages/demo/syntax/api/index';
import './pages/demo/syntax/stateless/index';
import './pages/demo/syntax/loop/index';
import './pages/demo/syntax/loop2/index';
import './pages/demo/syntax/loop3/index';
import './pages/demo/syntax/loop4/index';

import './pages/demo/syntax/extend/index';
import './pages/demo/syntax/inlineStyle/index';
import './pages/demo/syntax/if/index';
import './pages/demo/syntax/children/index';
import './pages/demo/syntax/await/index';
import './pages/demo/syntax/multiple/index';
import './pages/demo/syntax/renderprops/index';
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

import './app.scss';

class Demo extends React.Component {
    config = {
        window: {
            backgroundTextStyle: 'light',
            navigationBarBackgroundColor: '#0088a4',
            navigationBarTitleText: 'mpreact',
            navigationBarTextStyle: '#fff'
        },
        tabBar: {
            'color': '#929292',
            'selectedColor': '#00bcd4',
            'borderStyle': 'black',
            'backgroundColor': '#ffffff',
            'list': [
                {
                    'pagePath': 'pages/index/index',
                    'iconPath': 'assets/image/homepage_normal.png',
                    'selectedIconPath': 'assets/image/homepage_select.png',
                    'text': '首页',
                    'name': 'Home',
                    'selected': true
                },
                {
                    'pagePath': 'pages/demo/question/index/index',
                    'iconPath': 'assets/image/question_normal.png',
                    'selectedIconPath': 'assets/image/question_select.png',
                    'text': '问答社区',
                    'name': 'questionAndAnswer'
                },
                {
                    'pagePath': 'pages/demo/userCenter/index',
                    'iconPath': 'assets/image/uc_normal.png',
                    'selectedIconPath': 'assets/image/uc_select.png',
                    'text': '我的',
                    'name': 'My'
                }
            ]
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
// eslint-disable-next-line
App(new Demo());