const path = require('path');
const buildType = process.env.ANU_ENV;
const config = require('../../config/config');

module.exports = function(modules, json) {
    
    if (modules.componentType !== 'App') {
        return json;
    }
    let configJson = {};
    try {
        Object.assign(configJson, require( path.join(process.cwd(), 'source', `${buildType}Config.json` )));
    } catch (err) {
       
    }

    if (buildType != 'quick') {
        delete configJson.subPackages;
        delete configJson.subpackages;
    }
    Object.assign(configJson.plugins, config.plugins);
    Object.assign(json, configJson);
    return json;
}