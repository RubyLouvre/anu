const { MAP } = require('../../consts/index');
const { successLog } = require('../logger/index');
const utils = require('../../packages/utils/index');
const errorStack = require('../logger/queue');
const compress = utils.compress();




const isBrokenFile = function(fildId){
    return errorStack.error.some(function(error){
        return error.id === fildId;
    });
};



/**
 * queues 存放需要输出的文件
 * exportCode fileLoader的输出结果，提供给 webpack，用来解析下个依赖文件
 */

module.exports = async function({ queues = [], exportCode = '' }, map, meta) {

    if ( isBrokenFile(this.resourcePath) ) {
        queues = [];
        exportCode = '';
    }
   

    this._compiler.NANACHI = this._compiler.NANACHI || {};
    this._compiler.NANACHI.webviews = this._compiler.NANACHI.webviews || [];
    if ( utils.isWebView(this.resourcePath) ) {
        this._compiler.NANACHI.webviews.push({
            id: this.resourcePath
        });

        queues = [];
        exportCode = '';
    }

    const callback = this.async();
    queues.forEach(({ code, path: filePath, type }) => {
        const relativePath = filePath.replace(/\.\w+$/, `.${MAP[this.nanachiOptions.platform]['EXT_NAME'][type] || type}`);
        if (this.nanachiOptions.compress) {
            code = typeof compress[type] === 'function' && compress[type](code) || code;
        }
        
        if (type === 'ux') {
            // ux文件情况特殊，需要同时监听js和css的变化，对同一个文件调用两次this.emitFile会有缓存问题
            this._compilation.assets[relativePath] = {
                source: function() {
                    return code;
                },
                size: function() {
                    return code.length;
                }
            };
        } else {
            this.emitFile(relativePath, code, map);
        }
        
        successLog(relativePath, code);
    });
    
    callback(null, exportCode, map, meta);
};