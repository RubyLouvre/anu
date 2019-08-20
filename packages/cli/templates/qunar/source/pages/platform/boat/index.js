import React from '@react';
import './index.scss';
/*eslint-disable*/
const WEEK = ['周日','周一','周二','周三','周四','周五','周六'];
class P extends React.Component {
    constructor() {
        super();
        this.state = {
            date: '',
            orginCity: '鼓浪屿',
            targerCity: '厦门',
            isStartCity: true
        };
    }
    componentWillMount() {
        React.getApp().globalData.dateSelect = new Date();
    }
    onShow() {
        let date = React.getApp().globalData.dateSelect;
        date = (date.getMonth()+1) + '月' + date.getDate() + '日 ' + WEEK[date.getDay()];
        this.setState({date});

        let app = React.getApp();
        if (app.globalData.citySelect) {
            if (this.state.isStartCity) {
                this.setState({orginCity: app.globalData.citySelect});
            } else {
                this.setState({targerCity: app.globalData.citySelect});
            }
        }
    }
    config = {
        backgroundColor: '#3399ff',
        navigationBarBackgroundColor: '#3399ff',
        navigationBarTitleText: '船票',
    }
    fun_tip() {
        React.api.showModal({
            title: '提示',
            content: '该部分仅展示，无具体功能!',
            showCancel: false
        });
    }
    toCitySelect(isStartCity) {
        this.setState({isStartCity});
        React.api.navigateTo({
            url: '/pages/platform/citySelect/index'
        });
    }
    toDateSelect() {
        React.api.navigateTo({
            url: '/pages/platform/calendar/index'
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
                <div class='boat-content'>
                    <div class='city-select-container'>
                        <div onTap={this.toCitySelect.bind(this,true)}  class='orgin-city-wrapper col'>
                            <div class='tip-wrapper row'><i class='dot'></i><span class="font-22">出发</span></div>
                            <div class='orgin-ctiy'><text class="font-38">{this.state.orginCity}</text></div>
                        </div>
                        <div onTap={this.exChangeCity.bind(this)} class='switch-logo'>
                            <image class="image" src='@assets/image/switch.png' />
                        </div>
                        <div onTap={this.toCitySelect.bind(this,false)}  class='target-city-wrapper col' >
                            <div class='tip-wrapper row'><i class='dot'></i><span class="font-22">到达</span></div>
                            <div class='target-ctiy'><text class="font-38">{this.state.targerCity}</text></div>
                        </div>
                    </div>
                    <div onTap={this.toDateSelect.bind(this)} class='date-select-container col'>
                        <text class='title'>出发日期</text>
                        <text class='date'>{this.state.date}</text>
                    </div>
                    <text onTap={this.fun_tip.bind(this)} class='search-btn'>开始查询</text>
                </div>
            </div>
        );
    }
}

export default P;