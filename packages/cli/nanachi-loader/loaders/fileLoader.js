const { MAP } = require('../../consts/index');
const { successLog } = require('../logger/index');
const utils = require('../../packages/utils/index');
const compress = utils.compress();

/**
 * queues 存放需要输出的文件
 * exportCode fileLoader的输出结果，提供给webpack，用来解析下个依赖文件
 */
module.exports = async function({ queues = [], exportCode = '' }, map, meta) {
    const callback = this.async();
    queues.forEach(({ code, path: filePath, type }) => {
        const relativePath = filePath.replace(/\.\w+$/, `.${MAP[this.nanachiOptions.platform]['EXT_NAME'][type] || type}`);
        if (this.nanachiOptions.compress) {
            code = typeof compress[type] === 'function' && compress[type](code) || code;
        }
        this.emitFile(relativePath, code, map);
        successLog(relativePath, code);
    });
    
    callback(null, exportCode, map, meta);
};