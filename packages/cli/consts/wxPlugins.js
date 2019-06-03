const path = require('path');
let plugins = {};
let userConfig;
try {
    userConfig = require(path.join(process.cwd(), 'source', 'wxConfig.json'));
} catch(e) {
}
if (userConfig && userConfig.plugins && Object.prototype.toString.call(userConfig.plugins) === '[object Object]') {
    Object.keys(userConfig.plugins).forEach(key => {
        if (!userConfig.plugins[key].name) {
            delete userConfig[key];
            throw `${key}配置项必须包含name字段`;
        }
    });
    plugins = userConfig.plugins;
}

module.exports = plugins;