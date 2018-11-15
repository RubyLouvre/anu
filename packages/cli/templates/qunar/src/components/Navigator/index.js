import React from  '@react';
const noop = function(){};
import './index.scss';

class Navigator extends React.Component{
    static defaultProps = {
        target: 'self',
        url: '',
        'open-type': 'navigate',
        'hover-class': 'navigator-hover'
    }
    goPage(){
        var method = this.props['open-type'];
        var hook = methodMap[method] || 'navigateTo';
        React.api[hook]({
            url: this.props.url,
            success:   this.props.bindsuccess || noop,
            fail:this.props.bindfail || noop,
            complete: this.props.bindcomplete || noop
        });
    }
    render(){
        return <div class={this.props.class} onTap={this.goPage.bind(this)}><text>{this.props.children}</text></div>;
    }

}
const methodMap = {
    navigate: 'navigateTo',
    redirect: 'redirectTo',
    switchTab: 'switchTab',
    reLaunch: 'reLaunch',
    'navigateBack': 'navigateBack'
};

export default Navigator;