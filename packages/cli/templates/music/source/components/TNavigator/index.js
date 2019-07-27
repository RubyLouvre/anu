import React from '@react';
import './index.scss';

class TNavigator extends React.Component {
    constructor() {
        super();
    }

    goto(url) {
        // console.log('url', url);
        if (url){
            React.api.navigateTo({ url });
        } else {
            React.api.showModal({
                title: '提示',
                content: '该部分仅展示，无具体功能!',
                showCancel: false
            });
        }
    }

    render() {
        return (
            <div class="navigator" onClick={this.goto.bind(this, this.props.url)}>{this.props.children}</div>
        );
    }
}
export default TNavigator;