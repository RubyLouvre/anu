const path = require('path');

module.exports = async function(code, map, meta) {
    const callback = this.async();
    const relativePath = this.resourcePath.replace(/^.+?\/node_modules\//, '');
    this.emitFile(path.join('npm', relativePath), code, map);
    
    callback(null, code, map, meta);
};