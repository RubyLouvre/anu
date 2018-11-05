import React from  '@react';
const noop = function(){};
class Navigator extends React.Component{
    constructor(props){
        super();
        props.className = props.class || '';
        this.props = props;
    }
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
        return <div class={this.props.className} onTap={this.goPage.bind(this)}>{this.props.children}</div>;
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