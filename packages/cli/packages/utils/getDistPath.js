function fixWinPath(p) {
    return p.replace(/\\/g, '/');
}
module.exports = function (sourcePath) {
    sourcePath = fixWinPath(sourcePath);
    let nodeModuleReg = /\/node_modules\//;
    let distPath = '';
    distPath = nodeModuleReg.test(sourcePath)
        ? sourcePath.replace(nodeModuleReg, '/dist/npm/')
        : sourcePath.replace(/\/source\//, '/dist/');
    distPath = process.env.ANU_ENV === 'quick'
        ? distPath.replace(/\/dist\//, '/src/')
        : distPath;
    return distPath;
};
