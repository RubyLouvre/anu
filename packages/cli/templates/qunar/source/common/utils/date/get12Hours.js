/**
 * 获得12小时制小时数
 *
 * @param {Date} date
 * @returns {Number} 12小时制小时
 */
export default function get12Hours(date) {

    let currentHour = date.getHours();
    return currentHour === 12 ? currentHour : currentHour % 12;
}