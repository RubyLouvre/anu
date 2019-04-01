const { EXT_MAP } = require('../../consts/index');
const { successLog } = require('../logger/index');

module.exports = async function({ queues = [], exportCode = '' }, map, meta) {
    const callback = this.async();
    queues.forEach(({ code, path: filePath, type }) => {
        const relativePath = filePath.replace(/\.\w+$/, `.${EXT_MAP[this.nanachiOptions.platform][type] || type}`);
        this.emitFile(relativePath, code, map);
        successLog(relativePath, code);
    });
    
    callback(null, exportCode, map, meta);
};