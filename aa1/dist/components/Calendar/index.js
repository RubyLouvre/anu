'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ReactWX = require('../../ReactWX');

var _ReactWX2 = _interopRequireDefault(_ReactWX);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Calendar() {
    this.state = {
        calendarArray: [],
        week: ['日', '一', '二', '三', '四', '五', '六']
    };
}

Calendar = _ReactWX2.default.miniCreateClass(Calendar, _ReactWX2.default.Component, {
    componentDidMount: function () {
        // 显示月份数
        const SHOWMONTH = 3;

        let data = [],
            yearMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
            today = new Date(),
            year = today.getFullYear(),
            month = today.getMonth();

        for (var i = 0; i < SHOWMONTH; i++) {
            var item1 = {},
                iYear = year,
                iMonth = month;

            // 判断是否增加年份
            if (iMonth + i < 13) {
                iMonth += i;
            } else {
                iYear += 1;
                iMonth = iMonth + i - 12;
            }

            item1.date = iYear + '年' + iMonth + '月';
            let daysArray = [];

            // 判断是否为闰年
            if (iYear % 4 === 0 && iYear % 100 !== 0 || iYear % 400 === 0) {
                yearMonth[1] = 29;
            } else {
                yearMonth[1] = 28;
            }

            let dayIndex = 1;
            for (var j = 0; j < 6; j++) {
                let arr = [];
                let firstDay = -1;
                // 判断第一天是周几
                if (j === 0) {
                    firstDay = new Date(iYear, iMonth - 1, 1).getDay();
                }
                // 是否遍历完当月日期
                if (dayIndex > yearMonth[iMonth - 1]) {
                    break;
                }
                //
                for (var k = 0; k < 7; k++) {
                    if (firstDay !== -1 && k < firstDay) {
                        arr.push({ isBlank: true });
                    } else {
                        if (dayIndex <= yearMonth[iMonth - 1]) {
                            var item = {
                                isBlank: false,
                                showDate: dayIndex,
                                isWeekend: k === 0 || k === 6 ? true : false,
                                date: new Date(iYear, iMonth - 1, dayIndex++)
                            };
                            arr.push(item);
                        } else {
                            arr.push({ isBlank: true });
                        }
                    }
                }
                daysArray.push(arr);
            }
            item1.daysArray = daysArray;
            data.push(item1);
        }
        this.setState({ calendarArray: data });
    },
    getDate: function (date) {
        this.props.handleTransmitDate && this.props.handleTransmitDate(date);
    },
    render: function () {
        var h = _ReactWX2.default.createElement;

        return h('view', { 'class': 'calendar' }, h('view', { 'class': 'e-head' }, this.state.week.map(function (item, idx) {
            return h('block', { key: item }, idx == 0 || idx == 6 ? h('view', { 'class': 'w s'
            }, item) : h('view', { 'class': 'w' }, item));
        }, this)), h('scroll-view', { 'class': 'm-calendar', 'scroll-y': 'true', 'scroll-into-div': this.state.todivId }, this.state.calendarArray.map(function (month, idx) {
            return h('view', { key: idx }, h('view', {
                'class': 'e-month' }, h('view', { 'class': 'b-header' }, month.date), month.daysArray.map(function (itemRow, Row) {
                return h('view', { 'class': 'b-row', key: Row }, itemRow.map(function (item1, index1) {
                    return h('block', { key: index1 }, item1.isBlank ? h('view', { 'class': 'item' }) : h('view', { onTap: this.getDate.bind(this, item1.date), 'class': 'item item-a ' + (item1.isWeekend ? 'weekend' : ''), 'data-tap-uid': 'e8927', 'data-class-uid': 'c5450', 'data-instance-uid': this.props.instanceUid, 'data-key': idx + '-' + Row + '-' + index1 }, h('view', { 'class': 'day' }, item1.showDate)));
                }, this));
            }, this)));
        }, this)));;
    },
    classUid: 'c5450'
}, {});

exports.default = Calendar;