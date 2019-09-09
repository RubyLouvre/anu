import React from '@react';
import './pages/index/index';

declare let App: any;
declare let global: any;

class Global extends React.Component {
    globalData = {}
    $data?: any;
    $def?: any;
    static config = {
        window: {
            navigationBarBackgroundColor: '#00afc7',
            backgroundTextStyle: 'light',
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
// eslint-disable-next-line
export default App(new Global());
