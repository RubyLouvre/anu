import React from "../../../../ReactWX";
import './index.less';
class P extends React.Component {
    constructor() {
        super();
        this.state = {
            defaultSize: 'default',
            primarySize: 'default',
            warnSize: 'default',
            disabled: false,
            plain: false,
            loading: false
        }
    }
    config = {
        "navigationBarBackgroundColor": "#ffffff",
        "navigationBarTextStyle": "#fff",
        "navigationBarBackgroundColor": "#0088a4",
        "navigationBarTitleText": "button demo",
        "backgroundColor": "#eeeeee",
        "backgroundTextStyle": "light"
    }
    setDisabled(){
        this.setState({
            disabled: !this.state.disabled
        })
    }
    setPlain(){
        this.setState({
            plain: !this.state.plain
        })
    }
    setLoading(){
        this.setState({
            loading: !this.state.loading
        })
    }
    onGotUserInfo(e){
        console.log(e.errMsg)
        console.log(e.userInfo)
        console.log(e.rawData)
    }
    render() {
        return (
            <div class='container button-wrapper'>
                <button type="default" 
                        size={this.state.defaultSize} 
                        loading={this.state.loading} 
                        plain={this.state.plain}
                        disabled={this.state.disabled}
                        bindtap="default" 
                        hover-class="other-button-hover"
                > default </button>
                <button 
                    type="primary" 
                    size={this.state.primarySize} 
                    loading={this.state.loading} 
                    plain={this.state.plain}
                    disabled={this.state.disabled} 
                    bindtap="primary"
                > primary </button>
                <button 
                    type="warn" 
                    size={this.state.warnSize} 
                    loading={this.state.loading} 
                    plain={this.state.plain}
                    disabled={this.state.disabled} 
                    bindtap="warn"
                > warn </button>
                <button onTap={this.setDisabled}>点击设置以上按钮disabled属性</button>
                <button onTap={this.setPlain}>点击设置以上按钮plain属性</button>
                <button onTap={this.setLoading}>点击设置以上按钮loading属性</button>
                <button open-type="contact">进入客服会话</button>
                <button open-type="getUserInfo" lang="zh_CN" onGetuserinfo={this.onGotUserInfo}>获取用户信息</button>
                <button open-type="openSetting">打开授权设置页</button>
            </div>
        );
    }
}

export default P;
