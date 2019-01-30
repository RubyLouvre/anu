import React from '@react';
import './index.scss';

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
                React.api.showModal({
                    title: '请拨打客服电话',
                    content: '95117',
                    showCancel: true,
                    cancelColor: '#69c0ff',
                    confirmText: '拨打',
                    confirmColor: '#69c0ff'
                });
                break;
            case 5:
                React.api.showModal({
                    title: '确认退出登录',
                    showCancel: true,
                    confirmColor: '#73d13d'
                });
                break;
            default: break;
        }
    }
    fun_tip() {
        React.api.showModal({
            title: '提示',
            content: '该部分仅展示，无具体功能!',
            showCancel: false
        });
    }
    config = {
        backgroundColor: 'rgb(245, 245, 245)',
        navigationBarBackgroundColor: '#fff',
        navigationBarTitleText: '个人中心',
        navigationBarTextStyle: 'black'
    };
    render() {
        return (
            <div class='user-center'>
                <div class='user-information anu-line'>
                    <image src='https://s.qunarzz.com/wechatapp/common/images/my/unLogin.png' class='user-image' />
                    <text class='user-name'>授权登录</text>
                </div>
                <div class='qunar-information anu-line'>
                    <div class="font-27">关注公众号</div>
                    <div class='right-content'>
                        <text class='right-message font-27'>去关注</text>
                        <image class='right-content-image' src='../../../assets/image/arrow.png' />
                    </div>
                </div>
                {
                    this.state.menu.map(function(item,index) {
                        return (
                            <div onTap={this.menuItemClick.bind(this,index)} class='menu-item anu-line' >
                                <text class={'menu-item-title' + (item.isArrow ? '': 'high-light')}>{item.title}</text>
                                {
                                    item.isArrow
                                        ? <image className='menu-item-image' src='../../../assets/image/arrow.png'/>
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