const path = require('path');
const cwd = process.cwd();
const getDistPath = require('./getDistPath');
const utils = require('./index');
const calculateAlias = require('./calculateAlias');
let cachedUsingComponents = {};

/**
 * case1: userPath/source/components/Calendar/index => /components/Calendar/index
 * case2: userPath/demo/source/pages/syntax/components/Label/index => /pages/syntax/components/Label/index
 * case3: userPath/demo/node_modules/schnee-ui/components/XButton/index.js => /npm/schnee-ui/components/XButton/index
 */
module.exports = function calculateComponentsPath( bag, nodeName ) {

    if (cachedUsingComponents[nodeName]) {
        return cachedUsingComponents[nodeName];
    }

    //求出引用模块的真实绝对路径 如：userPath/source/components/Calendar/index
    let realPath = path.join(
        path.dirname(bag.sourcePath),
        calculateAlias(bag.sourcePath, bag.source) //引用模块的相对路径
    );

    realPath = utils.fixWinPath(realPath).replace(/\.js$/, '');
    let usingPath = getDistPath(realPath)
        .replace(
            utils.fixWinPath( path.join(cwd, 'dist') ),
            ''
        );
        
    cachedUsingComponents[nodeName] = usingPath;
    return usingPath;
};