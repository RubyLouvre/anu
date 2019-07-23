/**
 * 返回当前编译文件打包后的绝对路径
 * 
 * @param {string} sourcePath 当前解析文件的绝对路径
 * @return {string} 当前解析文件打包后的路径, 如:
 *   node_modules/cookie/index.js => dist/npm/cookie/index.js
 *   source/components/Cat/index.js => dist/components/Cat/index.js
 *   source/common/login.js => dist/common/login.js
 */
function fixWinPath(p: string) {
    return p.replace(/\\/g, '/');
}
function getDistPath(sourcePath: string) {
    sourcePath = fixWinPath(sourcePath);
    let nodeModuleReg = /\/node_modules\//;
    let distPath = '';

    //如果是node_modules模块, 目录要替换成dist/npm, 否则换成 dist
    distPath = nodeModuleReg.test(sourcePath)
        ? sourcePath.replace( nodeModuleReg,  '/dist/npm/')
        : sourcePath.replace( /\/source\//, '/dist/');
    
    //快应用目录要替换成src
    distPath = process.env.ANU_ENV === 'quick' 
        ? distPath.replace(/\/dist\//, '/src/')
        : distPath;
    return distPath;
};

module.exports = getDistPath;
export default getDistPath;