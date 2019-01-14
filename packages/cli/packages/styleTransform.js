/* eslint no-console: 0 */
const path = require('path');
const queue = require('./queue');
const config = require('./config');
const utils = require('./utils');
const exitName = config[config['buildType']].styleExt;
const crypto = require('crypto');
const compileSassByPostCss = require('./stylesTransformer/postcssTransformSass');
const compileLessByPostCss = require('./stylesTransformer/postcssTransformLess');
const compileSass = require('./stylesTransformer/transformSass');
// const compileLess = require('./stylesTransformer/transformLess');
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
    let dist = utils.updatePath(filePath, config.sourceDir, 'dist');
    let { name, dir, ext} =  path.parse(dist);
    let distPath = '';
    config.buildType === 'h5'
        ? distPath = path.join(dir, `${name}${ext}`)
        : distPath = path.join(dir, `${name}.${exitName}`);
    return distPath;
};

//用户工程下是否有node-sass
let hasNodeSass = utils.hasNpm('node-sass');
const compilerMap = {
    '.less': compileLessByPostCss,
    '.css':  compileLessByPostCss,
    '.sass': hasNodeSass ? compileSass : compileSassByPostCss,
    '.scss': hasNodeSass ? compileSass : compileSassByPostCss
};

function runCompileStyle(filePath, originalCode){
    needUpdate(filePath, originalCode,  ()=>{
        let exitName = path.extname(filePath);

        if (config.buildType === 'h5') {
            queue.push({
                code: originalCode,
                path: getDist(filePath),
                type: 'css'
            });
            return;
        }

        // 补丁 queue的占位符, 防止同步代码执行时间过长产生的多次构建结束的问题
        const placeholder = {
            code: '',
            path: getDist(filePath),
            type: 'css'
        };
        queue.push(placeholder);
        // 补丁 END
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
                process.exit(1);
            });
    });
}

module.exports =  (data) => {
    let {id, originalCode} = data;
    runCompileStyle(id, originalCode);
};
