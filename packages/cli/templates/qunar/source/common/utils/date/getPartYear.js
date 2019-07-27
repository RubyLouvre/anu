/**
 * 获取年份的后两位
 * @param {Date} date
 * @returns {String} 日期年份的后两位
 */

export default function getPartYear(date) {

    let fullYear = date.getFullYear() + '';

    return fullYear.substring(fullYear.length - 2);
}