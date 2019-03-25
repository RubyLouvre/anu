/* eslint no-console: 0 */
const path = require('path');
const fs = require('fs');
const queue = require('./queue');
const config = require('./config');
const utils = require('./utils');
const exitName = config[config['buildType']].styleExt;
const crypto = require('crypto');
const compileSassByPostCss = require('./stylesTransformer/postcssTransformSass');
const compileLessByPostCss = require('./stylesTransformer/postcssTransformLess');
let cache = {};
//缓存层，避免重复编译
let needUpdate = (id, originalCode) => {
    let sha1 = crypto
        .createHash('sha1')
        .update(originalCode)
        .digest('hex');
    if (!cache[id] || cache[id] != sha1) {
        cache[id] = sha1;
        return true;
    }
    return false;
};

//获取dist路径
let getDist = (filePath) =>{
    let dist = utils.updatePath(filePath, config.sourceDir, 'dist');
    let { name, dir, ext} =  path.parse(dist);
    let distPath = '';
    config.buildType === 'h5'
        ? distPath = path.join(dir, `${name}${ext}`)
        : distPath = path.join(dir, `${name}.${exitName}`);
    return distPath;
};

const compilerMap = {
    '.less': compileLessByPostCss,
    '.css':  compileLessByPostCss,
    '.sass': compileSassByPostCss,
    '.scss': compileSassByPostCss
};

async function runCompileStyle(filePath, originalCode){
    if (needUpdate(filePath, originalCode)) {
        let exitName = path.extname(filePath);
        if (config.buildType === 'h5') {
            queue.push({
                code: originalCode,
                path: getDist(filePath),
                type: 'css'
            });
            return;
        }
        const result = await compilerMap[exitName](filePath, originalCode);
        let { code, deps } = result;
        queue.push({
            code: code,
            path: getDist(filePath),
            type: 'css'
        });
        // 递归编译@import依赖文件
        for (let i = 0; i < deps.length; i++) {
            const dep = deps[i];
            const code = fs.readFileSync(dep.file, 'utf-8');
            if (needUpdate(dep.file, code)) {
                const res = await compilerMap[exitName](dep.file, code);
                queue.push({
                    code: res.code,
                    path: getDist(dep.file),
                    type: 'css'
                });
            }
        }
    }
}

module.exports =  async (data) => {
    let {id, originalCode} = data;
    await runCompileStyle(id, originalCode);
};
