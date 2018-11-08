import React from  '@react';
const noop = function(){};
class Navigator extends React.Component{
    constructor(props){
       super(props);
       this.state = {
           title: props.children
       };
    }
    static defaultProps = {
        target: 'self',
        url: '',
        'open-type': 'navigate',
        'hover-class': 'navigator-hover'
    }
    componentWillReceiveProps(props){
        this.setState({
            title: props.children
        });
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
        return <div class={this.props.class} onTap={this.goPage.bind(this)}><text>{this.state.title}</text></div>;
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