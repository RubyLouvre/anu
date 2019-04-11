const path = require('path');

const isReact = function(sourcePath){
    return /React\w+\.js$/.test(path.basename(sourcePath));
};

module.exports = async function(code, map, meta) {
    const callback = this.async();
    if (isReact(this.resourcePath)) {
        this.emitFile(this.resourcePath.match(/React\w+\.js$/)[0], code, map);
        callback(null, '', map, meta);
        return;
    }
    
    const relativePath = this.resourcePath.replace(/^.+?\/node_modules\//, '');
    this.emitFile(path.join('npm', relativePath), code, map);
    callback(null, code, map, meta);
};