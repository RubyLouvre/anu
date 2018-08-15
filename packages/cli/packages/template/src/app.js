import React from './ReactWX';
import './pages/index/index';
import './pages/demo/form/index/index';
import './pages/demo/form/button/index';
import './pages/demo/form/checkbox/index';
import './pages/demo/form/input/index';
import './pages/demo/form/slider/index';
import './pages/demo/form/picker/index';
import './pages/demo/form/radio/index';
import './pages/demo/form/textarea/index';
import './pages/demo/form/label/index';
import './pages/demo/baseContent/base/index';
import './pages/demo/view/index/index';
import './pages/demo/view/view/index';
import './pages/demo/view/scrollView/index';
import './pages/demo/view/movableView/index';
import './pages/demo/view/swiper/index';
import './pages/demo/media/index/index';
import './pages/demo/media/audio/index';
import './pages/demo/media/image/index';
import './pages/demo/media/video/index';
import './pages/demo/media/camera/index';
import "./pages/demo/api/index";
import './pages/demo/extend/index';
import './pages/demo/extend/Dog';
import './pages/demo/extend/Husky';

import './app.less';

class Demo extends React.Component {
    config = {
        pages: [
            'pages/index/index',
            'pages/demo/form/index/index',
            'pages/demo/form/button/index',
            'pages/demo/form/checkbox/index',
            'pages/demo/form/input/index',
            'pages/demo/form/slider/index',
            'pages/demo/form/picker/index',
            'pages/demo/form/radio/index',
            'pages/demo/form/textarea/index',
            'pages/demo/form/label/index',
            'pages/demo/baseContent/base/index',
            'pages/demo/view/index/index',
            'pages/demo/view/view/index',
            'pages/demo/view/scrollView/index',
            'pages/demo/view/movableView/index',
            'pages/demo/view/swiper/index',
            'pages/demo/media/index/index',
            'pages/demo/media/audio/index',
            'pages/demo/media/image/index',
            'pages/demo/media/video/index',
            'pages/demo/media/camera/index',
            "pages/demo/api/index",
            'pages/demo/extend/index',
            'pages/demo/extend/Dog',
            'pages/demo/extend/Husky'
        ],
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
        console.log('App launched');
    }
}

App(new Demo());
