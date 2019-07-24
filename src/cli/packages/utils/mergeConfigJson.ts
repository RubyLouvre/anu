import * as path from 'path';
const buildType = process.env.ANU_ENV;
const config = require('../../config/config');

module.exports = function(modules: any, json: any) {
    
    if (modules.componentType !== 'App') {
        return json;
    }
    let configJson: any = {};
    let userConfig: any = {};
    try {
        userConfig = require( path.join(process.cwd(), 'source', `${buildType}Config.json` ))
    } catch (err) {
        
    }
    Object.assign(configJson, userConfig);

    if (buildType != 'quick') {
        delete configJson.subPackages;
        delete configJson.subpackages;
    }
    if (configJson.plugins) {
        Object.assign(configJson.plugins, config.plugins);
    }
    Object.assign(json, configJson);
    return json;
}