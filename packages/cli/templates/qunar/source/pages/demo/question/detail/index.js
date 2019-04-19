import React from '@react';
import './index.scss';

class P extends React.Component {
    constructor() {
        super();
        this.state = {
            data: {},
            answer: [],
            sortkey: 'byTime'
        };
    }
    componentDidMount() {
        let that = this;
        React.api.showLoading({
            title: '获取资源中',
            mask: true
        });
        React.api.request({
            url: 'http://yapi.demo.qunar.com/mock/11595/qunar/question/detail',
            success: function(data) {
                React.api.hideLoading();
                that.setState({data: data.data});
                that.setState({answer: [...that.state.answer,...data.data.answer]});            }
        });
    }
    switchSortkey() {
        this.setState({sortkey: this.state.sortkey === 'byTime' ? 'byHot' : 'byTime'});
    }
    config = {
        backgroundColor: '#fff',
        navigationBarBackgroundColor: '#fff',
        navigationBarTitleText: '问答详情',
        navigationBarTextStyle: 'black'
    };
    render() {
        return ( 
            <div class="detail-page">
                <div class='question-detail'>
                    <div class='title'>{this.state.data.question}</div>
                    <div class='city'>{this.state.data.city}</div>
                    <div class='other-infortion'>
                        <div>
                            <image class="image" src={this.state.data.userImage} />
                            <text class='userName text'>{this.state.data.userName}</text>
                            <text class='post-date text'>{this.state.data.date}</text>
                        </div>
                        <div class='eye-wrapper'>
                            <image class="image" src='../../../../assets/image/eye.png' />
                            <text class='eye-num text'>{this.state.data.eyeNum}</text>
                        </div>
                    </div>
                </div>
                <div class='question-prompt'>
                    <text class="text">{'共' + this.state.data.answerNum + '个回答'}</text>
                    <div onTap={this.switchSortkey.bind(this)} class='sort-wrapper'>
                        <image class="image" src='../../../../assets/image/sort.png' />
                        <text class="text">{this.state.sortkey === 'byTime' ? '按时间排序' : '按热度排序'}</text>
                    </div>
                </div>
                {
                    this.state.answer.map(function(item) {
                        return (
                            <div class='answer-wrapper' >
                                <div class='user-wrapper'>
                                    <image class="image" src={item.userImage} />
                                    <div class='name-time'>
                                        <text class='text-name'>{item.userName}</text>
                                        <text class='text time'>{item.time}</text>
                                    </div>
                                </div>
                                <div class='answer-desc'>{item.desc}</div>
                                <div class='agree-with-wrapper'>
                                    <image class="image" src='../../../../assets/image/agree_with.png'/>
                                    <text class="text">{item.agreeWithNum}</text>
                                </div>
                            </div>
                        );
                    })
                }
            </div>
        );
    }
}

export default P;