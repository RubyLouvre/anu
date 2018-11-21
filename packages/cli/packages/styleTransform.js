/* eslint no-console: 0 */
const path = require('path');
const queue = require('./queue');
const config = require('./config');
const utils = require('./utils');
const exitName = config[config['buildType']].styleExt;
const fs = require('fs');
const crypto = require('crypto');
const {compileSass, compileLess}= require('./stylesTransformer/postcssTransform');
let cache = {};

//缓存层，避免重复编译
let needUpdate = (id, fn) => {
    let code = fs.readFileSync(id).toString();
    let sha1 = crypto
        .createHash('sha1')
        .update(code)
        .digest('hex');
    if (!cache[id] || cache[id] != sha1) {
        cache[id] = sha1;
        fn();
    }
};

//获取dist路径
const getDist = (filePath) =>{
    filePath = utils.resolvePatchComponentPath(filePath);
    let dist = utils.updatePath(filePath, config.sourceDir, 'dist');
    let { name, dir, ext} =  path.parse(dist);
    if (config.buildType != 'quick') {
        return path.join(dir, `${name}.${exitName}`);
    } else {
        return path.join(dir, `${name}${ext}`);
    }
    
};

const compilerMap = {
    '.less': compileLess,
    '.css':  compileLess,
    '.sass': compileSass,
    '.scss': compileSass
};

function runCompileStyle(filePath){
    needUpdate(filePath, async ()=>{
        try {
            let exitName = path.extname(filePath);
            let {code} = await compilerMap[exitName](filePath);
            queue.push({
                code: code,
                path: getDist(filePath),
                type: 'css'
            });
            // importer.forEach((filePath)=>{
            //     runCompileStyle(filePath);
            // });
        } catch (err) {
            //console.log(filePath, '===')
            console.log(err);
            console.log();
        }
    });
}

module.exports =  (id) => {
    runCompileStyle(id);
};
