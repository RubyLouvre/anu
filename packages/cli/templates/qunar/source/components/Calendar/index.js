import React from '@react';
import './index.scss';
class Calendar extends React.Component {
    constructor() {
        super();
        this.state = {
            calendarArray: [],
            week: ['日', '一', '二', '三', '四', '五', '六']
        };

        this.env = process.env.ANU_ENV;
    }
    componentDidMount() {
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
                iMonth = month + 1;
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
            if ((iYear % 4 === 0 && iYear % 100 !== 0) || iYear % 400 === 0) {
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
    }
    getDate(date) {
        this.props.handleTransmitDate && this.props.handleTransmitDate(date);
    }
    render() {
        return (
            <div className="calendar">
                <div className="e-head">
                    {this.state.week.map(function(item, idx) {
                        return (
                            <block key={item}>
                                {idx == 0 || idx == 6 ? (
                                    <view className="w s">{item}</view>
                                ) : (
                                    <view className="w">{item}</view>
                                )}
                            </block>
                        );
                    })}
                </div>
                <scroll-view className="m-calendar" scroll-y="true" scroll-into-div={this.state.todivId}>
                    {this.state.calendarArray.map(function(month, idx) {
                        return (
                            <div key={idx}>
                                <div className="e-month">
                                    <div className="b-header">{month.date}</div>
                                    {month.daysArray.map(function(itemRow, Row) {
                                        return (
                                            <div className="b-row" key={Row}>
                                                {itemRow.map(function(item1, index1) {
                                                    return (
                                                        <block key={index1}>
                                                            {item1.isBlank ? (
                                                                <div className="row-item" />
                                                            ) : (
                                                                <div
                                                                    onTap={this.getDate.bind(this, item1.date)}
                                                                    className="row-item item-a"
                                                                >
                                                                    <div className={`day ${item1.isWeekend ? 'weekend' : ''}`}>{item1.showDate}</div>
                                                                </div>
                                                            )}
                                                        </block>
                                                    );
                                                })}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </scroll-view>
                {
                    this.env === 'web' ?
                        <style jsx>{`
                        .e-head {
                            top: 48px;
                        }
                    `}</style> :
                        null
                }
            </div>
        );
    }
}

export default Calendar;
