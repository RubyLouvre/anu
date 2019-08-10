export default {
    addDays: function (date, dayNum) {
        return new Date(date.getTime() + 86400000 * dayNum);
    },
    // 是否是闰年
    is_leap: function (year) {
        return year % 100 == 0 ? year % 400 == 0 ? 1 : 0 : year % 4 == 0 ? 1 : 0;
    },
    // 计算一个月有多少天
    // month为具体月份 0-11
    daysCountOfMonth: function (year, month) {
        var m_days = [31, 28 + this.is_leap(year), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        return m_days[month];
    },
    // 计算日历中一个月的行数
    weeksCountOfMonth: function (year, month) {
        // 计算月第一天是周几
        var date = new Date(year, month, 1);
        var first = date.getDay();
        var weeks = Math.ceil((this.daysCountOfMonth(year, month) + first) / 7);
        return weeks;
    }
};