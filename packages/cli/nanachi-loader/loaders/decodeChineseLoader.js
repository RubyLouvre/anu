/**
 * 解码中文字符， 这个已经没有用了
 */
const decodeChinese = require('../../packages/utils/decodeChinese');

module.exports = async function({ queues = [], exportCode = '' }, map, meta) {
    const callback = this.async();
    queues.forEach(({ code }, index) => {
        queues[index].code = decodeChinese(code.toString());
    });
    
    callback(null, {
        queues,
        exportCode
    }, map, meta);
};