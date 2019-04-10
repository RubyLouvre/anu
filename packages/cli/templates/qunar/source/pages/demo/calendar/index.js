import React from '@react';
import Calendar from '@components/Calendar/index';
// import QunarLoading from '@components/QunarLoading/index';
import dateFormat from '@common/utils/date/format';
import request from '@common/utils/request';
import util from '@common/utils/util';

class Data extends React.Component {
    constructor(props) {
        super(props);
        let { data } = props.query;  // 各个业务线请求的参数,通过url传入进来
        data = (data && util.json_parse(decodeURIComponent(data))) || {}; // 将参数，格式化为对象
        this.state = {
            queryData: data, //
            CNY_SYMBOL: '￥',
            TRAIN_MULTI_SELECT_MAIN_TEXT: '主选',
            TRAIN_MULTI_SELECT_SUB_TEXT: '备选',
            FORMAT_TYPE: 'yyyy-mm-dd',
            TRAIN_BOOKING_TEXT: '预约',
            ONE_DAY: 86400000,
            flag: true,
            calendarDays: data.calendarDays,
            monthIdFormat: 'yyyy-mm',
            multiSelectDateArr: [], // 多选日期的Arr
            updateInfoData: {},
            toViewId: '',
            firstSelected: '',
            networkData: {}
        };
        this.isFirst = false; // 是否是重新渲染的第一天，只有门票需要重新渲染
    }
    static config = {
        backgroundColor: '#FFF',
        navigationBarBackgroundColor: '#00BCD4',
        navigationBarTitleText: '选择日期',
        navigationBarTextStyle: 'white'
    };
    _changeNetwork(networkData = { status: 0 }) {  // 网络数据请求结果
        this.setState({
            networkData
        });
    }

    componentDidMount() {
        this.requestData();
        this.toViewId();
    }

    toViewId() {
        if (this.state.queryData && this.state.queryData.date) {
            var date = new Date(this.state.queryData.date);
            this.setState({
                toViewId: 'cal_' + dateFormat(date, this.state.monthIdFormat)
            });
        }
    }

    requestData() {
        if (!this.state.queryData.url || !this.state.queryData.reqData) { // 酒店不用去请求数据,火车票、机票、门票要去请求日历价格表
            return;
        }
        this._changeNetwork({ status: 3, loadingDesc: '加载中...' });
        request({
            host: decodeURIComponent(this.state.queryData.dataUrlHost) || 'https://wxapp.qunar.com',
            service: decodeURIComponent(this.state.queryData.url),
            param: this.state.queryData.reqData,
            success: this.handleRequestDataSuccess.bind(this),
            // fail: this.handleRequestDataFail.bind(this)
            fail: (err) => {
                this.handleRequestDataFail.bind(this, err);
            }
        });
    }

    handleRequestDataSuccess(res) {
        var bizType = this.state.queryData.bizType; // 获取业务线名称
        var data = {};
        this._changeNetwork();
        if (res.status === 0 && bizType === 'train') {
            data = this.dealTrain(res);
        } else if (res.data.code == 0 && bizType === 'flight') {
            data = this.dealFlight(res);
        } else if (res.statusCode == 200 && bizType === 'ticket') {
            // 其他按规定字段来的业务线，比如门票
            data = this.dealDefault(res);
        } else {
            this.handleRequestDataFail();
            return;
        }
        this.setState({
            updateInfoData: data
        });
        this.toViewId();
    }

    dealTrain(res) {
        var data = {};
        try {
            if (res.pre12306 && res.pre12306 > 0) {
                var pre12306 = res.pre12306;
                var preQunar = res.preQunar;
                var totalDays = pre12306 + preQunar;
                var day = new Date();
                for (var i = 1; i <= totalDays; i++) {
                    var key = dateFormat(day, this.state.FORMAT_TYPE);
                    data[key] = data[key] || {};
                    if (i > preQunar && i <= totalDays) {
                        data[key].text = this.state.TRAIN_BOOKING_TEXT;
                        data[key].isHighLight = true;
                    } else {
                        data[key].isDisabled = false;
                    }
                    day = new Date(day.getTime() + this.state.ONE_DAY);
                }
                this.setState({
                    calendarDays: totalDays
                });
            }
        } catch (err) {
            // eslint-disable-next-line
            console.log(err);
        }
        return data;
    }

    dealFlight(res) {
        var result = res.data;
        var data = result.priceTrendDataMap.goFTrend;
        for (var prop in data) {
            var item = data[prop];
            item['text'] = this.state.CNY_SYMBOL + item.price;
            item['isHighLight'] = item.isLowPrice === 1 ? true : false;
        }
        return data;
    }

    dealDefault(res) {
        var data = res.data.data;
        var date = this.state.queryData.date;
        if (!data[date]) {
            this.isFirst = true;
        }
        this.setState({
            updateInfoData: data
        });
        return data;
    }

    handleRequestDataFail() {
        var dataParams = this.state.queryData;
        var bizType = dataParams.bizType;
        if (bizType === 'ticket') {
            setTimeout(function() {
                React.api.navigateBack();
            }, 2000);
        }
        this._changeNetwork({
            status: -1,
            loadingDesc: '加载失败，请重试',
            showButton: true
        });
    }

    render() {
        return (
            <div class="anu-col">
                <Calendar
                    calendarDays = {this.state.calendarDays}
                    eDate = {this.state.queryData.eDate}
                    eventType = {this.state.queryData.eventType}
                    storageType = {this.state.queryData.storageType}
                    isDoubleSelect = {this.state.queryData.isDoubleSelect}
                    sText = {this.state.queryData.sText}
                    eText = {this.state.queryData.eText}
                    bizType = {this.state.queryData.bizType}
                    isMultiSelect = {this.state.queryData.isMultiSelect}
                    maxSelectDays = {this.state.queryData.maxSelectDays}
                    dates = {this.state.queryData.dates}
                    date = {this.state.queryData.date}
                    updateInfoData = {this.state.updateInfoData}
                    toViewId = {this.state.toViewId}
                />
            </div>
        );
    }
}
export default Data;