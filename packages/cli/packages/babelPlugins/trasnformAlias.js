let utils = require('../utils');
let fs = require('fs');
let path = require('path');
const cwd = process.cwd();
const { REACT_LIB_MAP } = require('../../consts');
const config = require('../config');

//对路径的一些兼容
let compatiblePath = (value)=>{
    value = /^\w/.test(value) ? `./${value}` : value; // import xx from 'A' => import xx from './A'
    return utils.isWin() ? value.replace(/\\/g, '/') : value;
};
const getDirname = dir => path.dirname(dir);
const parsePath = p => p.replace(/^(?=[\w])/, './');
const getUserAlias = () => {
    const json = JSON.parse(fs.readFileSync(path.resolve(cwd, 'package.json'), 'utf-8'));
    return json && json.nanachi && json.nanachi.alias || {};
};
const resolveRelativePath = (from, to) => parsePath(path.relative(from, to));
module.exports = (metaData)=>{
    let { sourcePath, platform } = metaData;
    
    const aliasMap = {
        '@react': 'source/' + REACT_LIB_MAP[platform],
        '@components': 'source/components'
    };
    Object.assign(aliasMap, getUserAlias());
    
    return [
        require('babel-plugin-module-resolver'),        //计算别名配置以及处理npm路径计算
        {
            resolvePath(moduleName) {
                if (/^(\/|\.)/.test(moduleName) ) {
                    return;
                }
                moduleName = moduleName.replace(new RegExp(`^(${Object.keys(aliasMap).join('|')})`), function(match, name) {
                    return aliasMap[name];
                });
                //针对async/await语法依赖的npm路径做处理
                let targetPath = path.resolve(cwd, moduleName);
                if (/regenerator-runtime\/runtime/.test(moduleName)) {
                    let regeneratorRuntimePath = utils.getRegeneratorRuntimePath(sourcePath);
                    targetPath = regeneratorRuntimePath;
                    let distDir = config['buildType'] === 'quick' ? 'src': 'dist';
                    targetPath  = utils.updatePath(
                        regeneratorRuntimePath, 
                        'node_modules', 
                        distDir + path.sep + 'npm'
                    );
                    Object.assign(
                        aliasMap,
                        utils.resolveAliasPath(sourcePath, { 'regenerator-runtime/runtime': regeneratorRuntimePath } )
                    );
                    
                    // if (!cache[dist]) {
                    //     queue.push({
                    //         code: fs.readFileSync(regeneratorRuntimePath, 'utf-8'),
                    //         path: dist,
                    //         type: 'npm'
                    //     });
                    //     cache[dist] = true;
                    // }
                }
                // let value = compatiblePath(aliasMap[moduleName]);
                return resolveRelativePath(getDirname(sourcePath), targetPath);
            }
        }
    ];
};