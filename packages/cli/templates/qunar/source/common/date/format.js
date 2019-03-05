import getPartYear from './getPartYear';
import get12Hours from './get12Hours';
import pad from '../pad';
/**
 * 日期格式化
 * 支持格式:
 *   hh: 带0补齐的12进制小时
 *   h: 不带0补齐的12进制小时
 *   HH: 带0补齐的24进制小时
 *   H: 不带0补齐的24进制小时
 *   MM: 带0补齐的分
 *   M: 不带0补齐的分
 *   ss: 带0补齐的秒
 *   s: 不带0补齐的秒
 *   yyyy: 四位年
 *   yy: 两位年
 *   mm: 带0补齐的月
 *   m: 不带0补齐的月
 *   dd: 带0补齐的日
 *   d: 不带0补齐的日
 *   w 汉字星期数
 * @param {Date} date
 * @param {String} pattern
 *
 * @retruns {String} 日期格式化后的字符串
 */
let chineseWeek = ['日', '一', '二', '三', '四', '五', '六'];
export default function dateFormat(date, pattern) {

    function replacer(patternPart, result) {
        pattern = pattern.replace(patternPart, result);
    }

    let year = date.getFullYear();
    let partYear = getPartYear(date);
    let month = date.getMonth() + 1;
    let dayOfMonth = date.getDate();
    let hours = date.getHours();
    let h12 = get12Hours(date);
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();
    let dayOfWeek = date.getDay();

    replacer(/yyyy/g, year);
    replacer(/yy/g, partYear);
    replacer(/mm/g, pad(month, 2));
    replacer(/m/g, month);
    replacer(/dd/g, pad(dayOfMonth, 2));
    replacer(/d/g, dayOfMonth);

    replacer(/HH/g, pad(hours, 2));
    replacer(/H/g, hours);
    replacer(/hh/g, pad(h12, 2));
    replacer(/h/g, h12);
    replacer(/MM/g, pad(minutes, 2));
    replacer(/M/g, minutes);
    replacer(/ss/g, pad(seconds, 2));
    replacer(/s/g, seconds);

    replacer(/w/g, chineseWeek[dayOfWeek]);

    return pattern;
}