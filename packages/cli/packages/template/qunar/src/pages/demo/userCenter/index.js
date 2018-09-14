import React from '@react';
import './index.less';

class P extends React.Component {
    constructor() {
        super();
        this.state = {
            menu: [
                {
                    title: '全部订单',
                    isArrow: true
                },{
                    title: '会员中心',
                    isArrow: true
                },{
                    title: '优惠券',
                    isArrow: true
                },{
                    title: '常用旅客',
                    isArrow: true
                },{
                    title: '联系客服',
                    isArrow: true
                },{
                    title: '退出登录',
                    isArrow: false
                }
            ]
        };
    }
    menuItemClick(type) {
        switch (type) {
            case 0: 
                this.fun_tip();
                break;
            case 1: 
                this.fun_tip();
                break;
            case 2: 
                this.fun_tip();
                break;
            case 3: 
                this.fun_tip();
                break;
            case 4:
                wx.showModal({
                    title: '请拨打客服电话',
                    content: '95117',
                    showCancel: true,
                    cancelColor: '#69c0ff',
                    confirmText: '拨打',
                    confirmColor: '#69c0ff'
                });
                break;
            case 5:
                wx.showModal({
                    title: '确认退出登录',
                    showCancel: true,
                    confirmColor: '#73d13d'
                });
                break;
            default: break;
        }
    }
    fun_tip() {
        wx.showModal({
            title: '提示',
            content: '该部分仅展示，无具体功能!',
            showCancel: false
        });
    }
    config = {
        backgroundColor: '#fff',
        navigationBarBackgroundColor: '#fff',
        navigationBarTitleText: '个人中心',
        navigationBarTextStyle: 'black'
    };
    render() {
        return (
            <div class='user-center'>
                <div class='user-information'>
                    <image src='https://s.qunarzz.com/wechatapp/common/images/my/unLogin.png' class='user-image' />
                    <span class='user-name'>授权登录</span>
                </div>
                <div onTap={this.fun_tip.bind(this)} class='qunar-information'>
                    <span>关注公众号</span>
                    <div class='right-content'>
                        <span class='right-message'>去关注</span>
                        <image src='../../../assets/image/arrow.png' />
                    </div>
                </div>
                {
                    this.state.menu.map(function(item,index) {
                        return (
                            <div onTap={this.menuItemClick.bind(this,index)} class='menu-item' key={index}>
                                <div class={'menu-item-title ' + (item.isArrow ? '': 'high-light')}>{item.title}</div>
                                {
                                    item.isArrow
                                        ? <image src='../../../assets/image/arrow.png'/>
                                        : ''
                                }
                            </div>
                        );
                    })
                }
            </div>
        );
    }
}

export default P;