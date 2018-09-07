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
import './pages/demo/syntax/extend/index';
import './pages/demo/syntax/inlineStyle/index';
import './pages/demo/syntax/loop3/index';
import './pages/demo/syntax/loopEvent/index';
import './pages/demo/syntax/if/index';
import './pages/demo/syntax/children/index';
import './pages/demo/syntax/await/index';

import './pages/demo/ticketSearch/index';
import './pages/demo/calendar/index';
import './pages/demo/moultiComponent/index';

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

// eslint-disable-next-line
App(new Demo());
