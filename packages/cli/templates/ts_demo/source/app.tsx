import React from '@react';
import './pages/index/index';
import Store from './store/index';
import { Provider } from 'mobx-react';

declare let App: any;
declare let global: any;

const store = new Store();

declare namespace React {
    class Component {
        props: any;
    }
}

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
    render() {
        return <Provider store={store}>{this.props.children}</Provider>
    }
}
// eslint-disable-next-line
export default App(new Global());
