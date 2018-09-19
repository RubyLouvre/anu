import React from '@react';
import './index.less';

class P extends React.Component {
    constructor() {
        super();
        this.state = {
            navBtnActiveIndex: 1,
            isQuestion: true,
            data: [],
            city: '北京'
        };
    }
    navItemClick(navBtnActiveIndex) {
        this.setState({navBtnActiveIndex});
        if (navBtnActiveIndex === 1 || navBtnActiveIndex === 2) {
            this.getData();
        }
    }
    switchFun() {
        this.setState({isQuestion: !this.state.isQuestion});
    }
    getData() {
        let that = this;
        React.api.showLoading({
            title: '获取资源中',
            mask: true
        });
        React.api.request({
            url: 'http://yapi.demo.qunar.com/mock/18752/qunar/question',
            success: function(data) {
                React.api.hideLoading();
                that.setState({data: data.data});
            }
        });
    }
    questionDetail() {
        React.api.navigateTo({ url: '../detail/index' });
    }
    componentDidMount() {
        this.getData();
    }
    componentDidShow() {
        let app = React.getApp();
        if (app.globalData.citySelect) {
            this.setState({city: app.globalData.citySelect});
        }
    }
    config = {
        backgroundColor: '#fff',
        navigationBarBackgroundColor: '#fff',
        navigationBarTitleText: '趣问答',
        navigationBarTextStyle: 'black'
    };
    toCitySelect() {
        this.navItemClick(2);
        React.api.navigateTo({ url: '../../citySelect/index' });
    }
    render() {
        return (
            <div class='question'>
                <div class='nav-wrapper'>
                    <div onTap={this.navItemClick.bind(this,0)} class={'nav-btn ' + (this.state.navBtnActiveIndex === 0 ? 'active': '')}>我的问答</div>
                    <div onTap={this.navItemClick.bind(this,1)} class={'nav-btn ' + (this.state.navBtnActiveIndex === 1 ? 'active': '')}>推荐</div>
                    <div class={'nav-btn ' + (this.state.navBtnActiveIndex === 2 ? 'active': '')}>
                        <text onTap={this.navItemClick.bind(this,2)}>{this.state.city}</text>
                        <image onTap={this.toCitySelect.bind(this)} class='open-icon' src= {'../../../../assets/image/' + (this.state.navBtnActiveIndex === 2 ? 'open_select.png': 'open.png')} />
                    </div>
                    <div class={'switch-bar ' + (this.state.navBtnActiveIndex === 1 ? '' : this.state.navBtnActiveIndex === 0 ? 'first-choose' : 'third-choose') }></div>
                </div>
                <div class='content'>
                    {
                        this.state.navBtnActiveIndex === 0
                            ? (
                                <div class='my-question-answer'>
                                    <div class='tool'>
                                        <text>{this.state.isQuestion ? '共有0个提问' : '共有0个回答'}</text>
                                        <div onTap={this.switchFun.bind(this)} class='switch-wrapper'>
                                            <text>{this.state.isQuestion ? '切换至回答' : '切换至提问'}</text>
                                        </div>
                                    </div>
                                    <div class='no-data-prompt'>
                                        <image src='../../../../assets/image/order_none.png' />
                                        <div class='message'>{this.state.isQuestion ? '您还没有发布过问题，去提问吧~' : '您还没有发布过回答，去回答吧~'}</div>
                                    </div>
                                </div>
                            )
                            : ''
                    }
                    {
                        this.state.navBtnActiveIndex === 1 || this.state.navBtnActiveIndex === 2
                            ? (
                                <div class='all-question'>
                                    {
                                        this.state.data.map(function(item,index) {
                                            return (
                                                <div onTap={this.questionDetail.bind(this)} class='question-item' key={index}>
                                                    {
                                                        item.isRemark ? <div class={'remark ' + (item.remark === '最新' ? 'new' : item.remark === '置顶' ? 'stick' : 'hot')}>{item.remark}</div> : ''
                                                    }
                                                    <div class='title'>{item.title}</div>
                                                    <div class='desc hide-text'>{item.desc}</div>
                                                    <div class='other-message'>
                                                        <div class='other-message-item'>
                                                            <image class='eye' src='../../../../assets/image/eye.png' />
                                                            <text class='eye-text'>{item.seeNum}</text>
                                                        </div>
                                                        <div class='other-message-item'>
                                                            <image src='../../../../assets/image/message.png' />
                                                            <text>{item.commentNum}</text>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    }
                                </div>
                            )
                            : ''
                    }
                </div>
            </div>
        );
    }
}

export default P;