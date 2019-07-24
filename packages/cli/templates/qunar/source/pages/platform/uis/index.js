import React from '@react';
import './index.scss';
import Navigator from '@components/Navigator/index';

/*eslint-disable*/
class P extends React.Component {
    constructor() {
        super();
        const ROOT_PATH = '/pages/platform/uis';
        this.state = {
            title: '跨平台组件',
            array: 'button'
                .split(',')
                .map(function (name) {
                    return {
                        url: `${ROOT_PATH}/${name}/index`,
                        name: name
                    };
                })
        };
    }
    config = {
        navigationBarTextStyle: '#fff',
        navigationBarBackgroundColor: '#0088a4',
        navigationBarTitleText: 'button demo',
        backgroundColor: '#eeeeee',
        backgroundTextStyle: 'light'
    };
    componentWillMount() {
        // eslint-disable-next-line
        console.log('native componentWillMount');
    }
    componentDidMount() {
        // eslint-disable-next-line
        console.log('native componentDidMount');
    }

    gotoSome(url) {
        if (url) {
            React.api.navigateTo({ url });
        }
    }
    render() {
        return (
            <div class='col'>
            <div class='page_hd'>{this.state.title}</div>
            <div class='page_bd'>
                <div class='col'>
                    {this.state.array.map(function (item) {
                        return (
                            <Navigator class="item" onClick={this.gotoSome.bind(this, item.url)}
                                open-type="navigate"
                                hover-class="navigator-hover"
                                url={item.url}>{item.name}</Navigator>
                        );
                    })}
                </div>
            </div>
        </div>
        );
    }
}

export default P;
