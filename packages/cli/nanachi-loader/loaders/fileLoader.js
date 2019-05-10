const { MAP } = require('../../consts/index');
const { successLog } = require('../logger/index');
const utils = require('../../packages/utils/index');
const path = require('path');

/**
 * queues 存放需要输出的文件
 * exportCode fileLoader的输出结果，提供给 webpack，用来解析下个依赖文件
 * 处理快应用的多个文件合并成一个文件，QQ小程序添加空的样式文件的各种情况
 */

module.exports = async function({ queues = [], exportCode = '' }, map, meta) {

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

        this.emitFile(relativePath, code, map);
        const outputPathName = utils.getDistName(this.nanachiOptions.platform);
        
        successLog(path.join(outputPathName, relativePath), code);
    });
    
    callback(null, exportCode, map, meta);
};