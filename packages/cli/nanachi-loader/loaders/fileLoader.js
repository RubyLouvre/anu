const { MAP } = require('../../consts/index');
const { successLog } = require('../logger/index');
const utils = require('../../packages/utils/index');
const errorStack = require('../logger/queue');
const path = require('path');

const isBrokenFile = function(fildId){
    return errorStack.error.some(function(error){
        return error.id === fildId;
    });
};

/**
 * queues 存放需要输出的文件
 * exportCode fileLoader的输出结果，提供给 webpack，用来解析下个依赖文件
 * 处理快应用的多个文件合并成一个文件，QQ小程序添加空的样式文件的各种情况
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
    queues.forEach(({ code = '', path: relativePath, type }) => {
        //qq轻应用，页面必须有样式，否则页面无法渲染，这是qq轻应用bug
        if ( this.nanachiOptions.platform === 'qq' && /[\/\\](pages|components)[\/\\]/.test(this.resourcePath) && path.parse(this.resourcePath).base === 'index.js' ) {
            //to do .css 有问题
            if (!this._compilation.assets[relativePath]) {
                this.emitFile(path.join(path.dirname(relativePath), 'index.qss'), '', map);
            }
        }
        
        // if (type === 'ux') {
        //     // ux文件情况特殊，需要同时监听js和css的变化，对同一个文件调用两次this.emitFile会有缓存问题
        //     this._compilation.assets[relativePath] = {
        //         source: function() {
        //             return code;
        //         },
        //         size: function() {
        //             return code.length;
        //         }
        //     };
        // } else {
        //     this.emitFile(relativePath, code, map);
        // }

        this.emitFile(relativePath, code, map);
        const outputPathName = this.nanachiOptions.platform === 'quick' ? './src' : './dist';
        
        successLog(path.join(outputPathName, relativePath), code);
    });
    
    callback(null, exportCode, map, meta);
};