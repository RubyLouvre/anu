/**
 * 对目标数字进行0补齐处理
 * @param {Number} source 需要0补齐处理的数字
 * @param {Nummber} length 需要输出的长度
 *
 * @returns {String} 对目标数字进行0补齐处理后的结果
 */
export default function pad(source, length) {

    let pre = '';
    let isNegative = source < 0;
    let str = String(Math.abs(source));

    if (str.length < length) {
        for (let i = 0; i < length - str.length; i++) {
            pre += '0';
        }
    }

    return (isNegative ? '-' : '') + pre + str;
}