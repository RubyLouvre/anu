let utils = require('../utils');
let fs = require('fs');
let path = require('path');
let config = require('../config');
let queue = require('../queue');
let cache = {};

//对路径的一些兼容
let compatiblePath = (value)=>{
    value = /^\w/.test(value) ? `./${value}` : value; // import xx from 'A' => import xx from './A'
    return utils.isWin() ? value.replace(/\\/g, '/') : value;
};
module.exports = (metaData)=>{
    let {sourcePath, resolvedIds} = metaData;
    let aliasMap = utils.resolveAliasPath(sourcePath, resolvedIds);
    
    return [
        require('babel-plugin-module-resolver'),        //计算别名配置以及处理npm路径计算
        {
            resolvePath(moduleName) {
                if (/^(\/|\.)/.test(moduleName) ) {
                    return;
                }

                //针对async/await语法依赖的npm路径做处理
                if (/regenerator-runtime\/runtime/.test(moduleName)) {
                    let regeneratorRuntimePath = utils.getRegeneratorRuntimePath(sourcePath);
                    let distDir = config['buildType'] === 'quick' ? 'src': 'dist';
                    let dist  = utils.updatePath(
                        regeneratorRuntimePath, 
                        'node_modules', 
                        distDir + path.sep + 'npm'
                    );
                    Object.assign(
                        aliasMap,
                        utils.resolveAliasPath(sourcePath, { 'regenerator-runtime/runtime': regeneratorRuntimePath } )
                    );
                    
                    if (!cache[dist]) {
                        // 补丁 queue的占位符, 防止同步代码执行时间过长产生的多次构建结束的问题
                        const placeholder = {
                            code: '',
                            path: dist,
                            type: 'npm'
                        };
                        queue.push(placeholder);
                        // 补丁 END
                        
                        queue.push({
                            code: fs.readFileSync(regeneratorRuntimePath, 'utf-8'),
                            path: dist,
                            type: 'npm'
                        });
                        cache[dist] = true;
                    }
                }
                let value = compatiblePath(aliasMap[moduleName]);
                return value;
            }
        }
    ];
};