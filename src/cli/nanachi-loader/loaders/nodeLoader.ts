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
            IfStatement: function(astPath: any) {
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
            },
            CallExpression: function(astPath: any) {
                // define(['react', 'xxx']) => define()
                // 防止基于webpack编译系的小程序如百度小程序查找 amd define的node_modules依赖，会暴依赖找不到
                // 删掉参数不会造成影响，现在几乎都是es, cjs模块化优先
                const calleeName = astPath.get('callee');
                if (calleeName.node.name === 'define') {
                    astPath.node.arguments = [];
                }
            }
        }
    }
}

module.exports = async function(code: string, map: any, meta: any) {
    
    const callback = this.async();
    let relativePath = '';
    let queues: Array<NanachiQueue>;
    // 如果不是业务目录下的资源，直接返回空
    if (/\/(webpack)|(process)\//.test(this.resourcePath.replace(/\\/g, ''))) {
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