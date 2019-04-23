/**
 * 解码中文字符
 */
const utils = require('../../packages/utils/index');

module.exports = async function({ queues = [], exportCode = '' }, map, meta) {
    const callback = this.async();
    queues.forEach(({ code }, index) => {
        queues[index].code = utils.decodeChinese(code.toString());
    });
    
    callback(null, {
        queues,
        exportCode
    }, map, meta);
};