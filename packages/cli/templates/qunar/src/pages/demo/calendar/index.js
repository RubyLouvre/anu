import React from '@react';
import Calendar from '../../../components/Calendar/index';
class P extends React.Component {
    constructor() {
        super();
    }
    handleShowDate(date) {
        React.api.showModal({
            title: '提示',
            content:
        '选择日期为：' + date.getFullYear() + '年' + (date.getMonth()+1) + '月' + date.getDate() + '日',
            success: e => {
                if (e.confirm) {
                    var app = React.getApp();
                    app.globalData.dateSelect = date;
                    React.api.navigateBack();
                }
            }
        });
    }
    render() {
        return (
            <div class="calendar-containar">
                <Calendar handleTransmitDate={this.handleShowDate.bind(this)} />
            </div>
        );
    }
}
export default P;
