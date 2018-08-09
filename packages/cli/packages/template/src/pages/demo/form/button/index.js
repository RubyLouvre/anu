import React from "../../../../ReactWX";
class P extends React.Component {
    constructor(props) {
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
        console.log(e.detail.errMsg)
        console.log(e.detail.userInfo)
        console.log(e.detail.rawData)
    }
    render() {
        return (
            <div class='container'>
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
                <button bindtap="setDisabled">点击设置以上按钮disabled属性</button>
                <button bindtap="setPlain">点击设置以上按钮plain属性</button>
                <button bindtap="setLoading">点击设置以上按钮loading属性</button>
                <button open-type="contact">进入客服会话</button>
                <button open-type="getUserInfo" lang="zh_CN" bindgetuserinfo="onGotUserInfo">获取用户信息</button>
                <button open-type="openSetting">打开授权设置页</button>
            </div>
        );
    }
}
Page(React.createPage(P, "pages/demo/form/button/index"));
export default P;
