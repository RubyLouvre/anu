const path = require('path');
const { successLog } = require('../logger/index');

const isReact = function(sourcePath){
    return /React\w+\.js$/.test(path.basename(sourcePath));
};

module.exports = async function(code, map, meta) {
    const callback = this.async();
    let relativePath = '';
    // 如果不是业务目录下的资源，直接return
    if (!this.resourcePath.startsWith(process.cwd())) {
        callback(null, code, map, meta);
        return;
    }
    if (isReact(this.resourcePath)) {
        relativePath = this.resourcePath.match(/React\w+\.js$/)[0];
        this.emitFile(relativePath, code, map);
        successLog(relativePath, code);
        callback(null, '', map, meta);
        return;
    }
    
    relativePath = path.join('npm', this.resourcePath.replace(/^.+?\/node_modules\//, ''));
    this.emitFile(relativePath, code, map);
    successLog(relativePath, code);
    callback(null, code, map, meta);
};