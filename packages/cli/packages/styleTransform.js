/* eslint no-console: 0 */
const path = require('path');
const queue = require('./queue');
const config = require('./config');
const utils = require('./utils');
const exitName = config[config['buildType']].styleExt;
const crypto = require('crypto');
const compileSassByPostCss = require('./stylesTransformer/postcssTransformSass');
const compileSass = require('./stylesTransformer/transformSass');
const compileLess = require('./stylesTransformer/transformLess');
let cache = {};
//缓存层，避免重复编译
let needUpdate = (id, originalCode, fn) => {
    let sha1 = crypto
        .createHash('sha1')
        .update(originalCode)
        .digest('hex');
    if (!cache[id] || cache[id] != sha1) {
        cache[id] = sha1;
        fn();
    }
};

//获取dist路径
let getDist = (filePath) =>{
    filePath = utils.resolvePatchComponentPath(filePath);
    let dist = utils.updatePath(filePath, config.sourceDir, 'dist');
    let { name, dir} =  path.parse(dist);
    return path.join(dir, `${name}.${exitName}`);
};

//用户工程下是否有node-sass
let hasNodeSass = utils.hasNpm('node-sass');
const compilerMap = {
    '.less': compileLess,
    '.css':  compileLess,
    '.sass': hasNodeSass ? compileSass : compileSassByPostCss,
    '.scss': hasNodeSass ? compileSass : compileSassByPostCss
};

function runCompileStyle(filePath, originalCode){
    needUpdate(filePath, originalCode,  ()=>{
        let exitName = path.extname(filePath);
        compilerMap[exitName](filePath, originalCode)
            .then((result)=>{
                let { code } = result;
                queue.push({
                    code: code,
                    path: getDist(filePath),
                    type: 'css'
                });
            })
            .catch((err)=>{
                // eslint-disable-next-line
                console.log(filePath, '\n', err);
            });
    });
}

module.exports =  (data) => {
    let {id, originalCode} = data;
    runCompileStyle(id, originalCode);
};
