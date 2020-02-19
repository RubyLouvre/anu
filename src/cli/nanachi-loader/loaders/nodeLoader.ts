import * as path from 'path';
import * as babel from '@babel/core';
import { NanachiQueue } from './nanachiLoader';

const isReact = function(sourcePath: string){
    // for win
    const ReactRegExp = new RegExp(`\\${path.sep}source\\${path.sep}React\\w+\\.js$`);
    return ReactRegExp.test(sourcePath);
};

function patchMobx() {
    const ctx = this;
    return {
        visitor: {
            IfStatement: function(astPath) {
                /**
                 * if (typeof process !== 'undefined' && process.env.NODE_ENV === 'production') {
                        module.exports = require('./mobx.min.js');
                    } else {
                        module.exports = require('./mobx.js');
                    }

                    =>

                    module.exports = require('./mobx.min.js');
                 */
                if (!/\/node_modules\/mobx\/lib\/index/
                    .test(
                        ctx.resourcePath.replace(/\\/g, '/') // for win
                    )
                ) return;
                astPath.replaceWith(astPath.get('consequent.body.0'));
            }
        }
    }
}

module.exports = async function(code: string, map: any, meta: any) {
    
    const callback = this.async();
    let relativePath = '';
    let queues: Array<NanachiQueue>;
    // 如果不是业务目录下的资源，直接返回空
    if (/\/webpack\//.test(this.resourcePath.replace(/\\/g, ''))) {
        queues = [];
        callback(null, {
            queues,
            exportCode: code
        }, map, meta);
        return;
    }
    var ctx = this;
    // 处理第三方模块中的环境变量，如process.env.NODE_ENV
    code = babel.transformSync(code, {
        configFile: false,
        babelrc: false,
        plugins: [
            ...require('../../packages/babelPlugins/transformEnv'),
            patchMobx.bind(this)
        ]
    }).code;
    if (isReact(this.resourcePath)) {
        relativePath = this.resourcePath.match(/React\w+\.js$/)[0];
        queues = [{
            code,
            path: relativePath,
            type: 'js'
        }];
        callback(null, {
            queues,
            exportCode: ''
        }, map, meta);
        return;
    }
    
    relativePath = path.join('npm', this.resourcePath.replace(/^.+?[\\\/]node_modules[\\\/]/, ''));
    // 解析node_modules中的npm包路径， 如： require('abc') => require('../../abc');
    queues = [{
        code,
        path: relativePath,
        type: 'js'
    }];
    callback(null, {
        queues,
        exportCode: code
    }, map, meta);
};