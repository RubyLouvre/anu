import * as path from 'path';
const cwd = process.cwd();
const getDistPath = require('./getDistPath');
const calculateAlias = require('./calculateAlias');
let cachedUsingComponents: {
    [props: string]: string;
} = {};

/**
 * case1: userPath/source/components/Calendar/index => /components/Calendar/index
 * case2: userPath/demo/source/pages/syntax/components/Label/index => /pages/syntax/components/Label/index
 * case3: userPath/demo/node_modules/schnee-ui/components/XButton/index.js => /npm/schnee-ui/components/XButton/index
 */
function fixWinPath(p: string) {
    return p.replace(/\\/g, '/');
}
module.exports = function calculateComponentsPath( bag: any ) {
    
    if (!path.isAbsolute(bag.sourcePath)) {
        console.error('bag.sourcePath 必须为绝对路径.');
        process.exit(1);
    }

    if (cachedUsingComponents[bag.source]) {
        return cachedUsingComponents[bag.source];
    }
   
    //求出引用模块的真实绝对路径 如：userPath/source/components/Calendar/index
    let realPath = path.join(
        path.dirname(bag.sourcePath),
        calculateAlias(bag.sourcePath, bag.source) //引用模块的相对路径
    );


    realPath = fixWinPath(realPath).replace(/\.js$/, '');
    let usingPath = getDistPath(realPath)
        .replace(
            fixWinPath( path.join(cwd, 'dist') ),
            ''
        );

        
    cachedUsingComponents[bag.source] = usingPath;
    return usingPath;
};