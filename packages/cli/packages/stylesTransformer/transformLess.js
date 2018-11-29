const less = require('less');
const path = require('path');
const fs = require('fs');
const config = require('../config');
const utils = require('../utils');
const exitName = config[config['buildType']].styleExt;
const validateStyle = require('../validateStyle');
const getAliasFileManager = require('less-import-aliases');
let queue = require('../queue');
let cache = {};

//获取dist路径
let getDist = (filePath) =>{
    filePath = utils.resolvePatchComponentPath(filePath);
    let dist = utils.updatePath(filePath, config.sourceDir, 'dist');
    let { name, dir} =  path.parse(dist);
    return path.join(dir, `${name}.${exitName || 'less'}`);
};

let getAlias = ()=>{
    let cwd = process.cwd();
    let pkg = require(path.join( cwd, 'package.json' ));
    let alias = ( pkg.nanachi || pkg.mpreact || {} ).alias || {};
    let result = {};
    Object.keys(alias).forEach((key)=>{
        //The key has to be used without "at[@]" prefix
        //https://www.npmjs.com/package/less-import-aliases
        result[key.replace(/@/, '')] = path.join( cwd, alias[key]);
    });
    return result;
};


const renderLess = (filePath, originalCode)=>{
    
    cache[filePath] = true;
    originalCode = originalCode || fs.readFileSync(filePath).toString();
    //获取所有的@import
    //https://stackoverflow.com/questions/37377964/find-all-imported-file-names-from-a-source-file-with-regexp-javascript?answertab=active#tab-top
    let importerList = originalCode.match(/(?:@import)\s+([^;]+)/igm) || [];
    let importerPathList = [];
    //过滤出含有(reference)引用的@import  [ '@import (reference)  \'./a.less\'' ]
    importerList = importerList.filter((importer)=>{
        return /\(\s*reference\s*\)/.test(importer);
    });

    //获取@import资源路径 @import (reference)  \'./a.less\' => ./a.less
    importerPathList = importerList.map((importer)=>{
        return importer.match(/['"]\s*.+\s*['"]/)[0].replace(/['"]/g, '').trim();
    });
    //去重
    importerPathList = Array.from(new Set(importerPathList));

    //处理alias
    importerPathList = importerPathList.map((importer)=>{
        return utils.resolveStyleAlias(importer, path.dirname(filePath));
    });

    return new Promise((resolve, reject)=>{
        less.render(
            originalCode,
            {
                filename: filePath,
                plugins: [
                    new getAliasFileManager({
                        aliases: getAlias()
                    })
                ]
            }
        )
            .then((res)=>{
                let code = validateStyle(res.css);
           
                let deps = importerPathList.map((importerPath)=>{
                //处理alias
                    return utils.resolveStyleAlias(importerPath, path.dirname(filePath));
                });

                //合并@import依赖语句
                let importCode = deps.map((importer)=>{
                    return `@import '${importer.replace(/\.less$/, `.${exitName || 'less' }`)}';`;
                });
                code = importCode.join('\n') + '\n' + code;
            
                resolve({
                    code: code
                });
           
                //编译@import依赖资源
                deps.forEach((dep)=>{
                    let importer = dep;
                    let abPath = path.resolve(path.dirname(filePath), importer);
                    if (cache[abPath]) return;
                    renderLess(abPath, fs.readFileSync(abPath).toString())
                        .then((res)=>{
                            queue.push({
                                path:  getDist(abPath),
                                code: res.code
                            });
                        })
                        .catch((err)=>{
                           // eslint-disable-next-line
                           console.log(err);
                       });
                });

            })
            .catch((err)=>{
                reject(err);
            });
    });
};

module.exports = renderLess;