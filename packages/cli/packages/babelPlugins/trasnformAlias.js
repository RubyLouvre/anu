let utils = require('../utils');
let fs = require('fs');
let path = require('path');
let queue = require('../queue');


//对路径的一些兼容
let compatiblePath = (value)=>{
    value = /^\w/.test(value) ? `./${value}` : value; // import xx from 'A' => import xx from './A'
    return utils.isWin() ? value.replace(/\\/g, '/') : value;
};
module.exports = (metaData)=>{
    let {sourcePath, resolvedIds} = metaData;
    let aliasMap = Object.assign(
        utils.updateCustomAlias(sourcePath, resolvedIds),
        utils.updateNpmAlias(sourcePath, resolvedIds)
    );
   
    return [
        require('babel-plugin-module-resolver'),        //计算别名配置以及处理npm路径计算
        {
            resolvePath(moduleName) {
                if (!utils.isNpm(moduleName)) return;
                //针对async/await语法依赖的npm路径做处理
                if (/regenerator-runtime\/runtime/.test(moduleName)) {
                    let regeneratorRuntimePath = utils.getRegeneratorRuntimePath(sourcePath);
                    queue.push({
                        code: fs.readFileSync(regeneratorRuntimePath, 'utf-8'),
                        path: utils.updatePath(
                            regeneratorRuntimePath,
                            'node_modules',
                            'dist' + path.sep + 'npm'
                        ),
                        type: 'npm'
                    });
                    Object.assign(
                        aliasMap,
                        utils.updateNpmAlias(sourcePath, { 'regenerator-runtime/runtime': regeneratorRuntimePath } )
                    );
                }
                let value = compatiblePath(aliasMap[moduleName]);
                return value;
            }
        }
    ];
};