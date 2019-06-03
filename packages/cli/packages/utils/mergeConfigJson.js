const path = require('path');
const buildType = process.env.ANU_ENV;

const deepClone = (obj) => JSON.parse(JSON.stringify(obj));

module.exports = function(modules, json) {
    
    if (modules.componentType !== 'App') {
        return json;
    }
    let configJson = {};
    try {
        Object.assign(configJson, deepClone(require( path.join(process.cwd(), 'source', `${buildType}Config.json` ))));
    } catch (err) {
       
    }

    if (buildType != 'quick') {
        delete configJson.subPackages;
        delete configJson.subpackages;
    }
    if (configJson.plugins) {
        Object.keys(configJson.plugins).forEach(key => {
            // 删除plugins.goodsSharePlugin.name字段
            if (configJson.plugins[key].name) delete configJson.plugins[key].name;
        });
    }
    

    Object.assign(json, configJson);
    return json;
}