import React from '@react';
import './index.less';

const WEEK = ['周日','周一','周二','周三','周四','周五','周六'];
class P extends React.Component {
    constructor() {
        super();
        this.state = {
            date: '',
            orginCity: '鼓浪屿',
            targerCity: '厦门'
        };
    }
    componentDidMount() {
        React.getApp().globalData.dateSelect = new Date();
    }
    componentDidShow() {
        let date = React.getApp().globalData.dateSelect;
        date = (date.getMonth()+1) + '月' + date.getDate() + '日 ' + WEEK[date.getDay()];
        this.setState({date});
    }
    config = {
        backgroundColor: '3399ff',
        navigationBarBackgroundColor: '#3399ff',
        navigationBarTitleText: '船票',
    }
    fun_tip() {
        wx.showModal({
            title: '提示',
            content: '该部分仅展示，无具体功能!',
            showCancel: false
        });
    }
    toDateSelect() {
        wx.navigateTo({
            url: '../../demo/calendar/index'
        });
    }
    exChangeCity() {
        let curData = this.state.orginCity;
        this.setState({orginCity: this.state.targerCity});
        this.setState({targerCity: curData});
    }
    render() {
        return (
            <div class='boat'>
                <div class='content'>
                    <div class='city-select-container'>
                        <div onTap={this.fun_tip.bind(this)}  class='orgin-city-wrapper'>
                            <div cglobalDatalass='tip-wrapper'><i class='dot'></i><span>出发</span></div>
                            <div class='orgin-ctiy'>{this.state.orginCity}</div>
                        </div>
                        <div onTap={this.exChangeCity.bind(this)} class='switch-logo'>
                            <image src='../../../assets/image/switch.png' />
                        </div>
                        <div onTap={this.fun_tip.bind(this)}  class='target-city-wrapper' >
                            <div class='tip-wrapper'><i class='dot'></i>到达</div>
                            <div class='target-ctiy'>{this.state.targerCity}</div>
                        </div>
                    </div>
                    <div onTap={this.toDateSelect.bind(this)} class='date-select-container'>
                        <div class='title'>出发日期</div>
                        <div class='date'>{this.state.date}</div>
                    </div>
                    <div onTap={this.fun_tip.bind(this)} class='search-btn'>开始查询</div>
                </div>
            </div>
        );
    }
}

export default P;