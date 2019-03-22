
//分包配置
const path = require('path');
const buildType = process.env.ANU_ENV;
const supportPlat = ['wx', 'bu'];
const keys = {
    bu: 'subPackages',
    wx: 'subpackages'
};
module.exports = function(modules, json) {
    
    if (modules.componentType !== 'App') {
        return json;
    }
    if (!supportPlat.includes(buildType)) {
        console.log(json, '23');
        return json;
    }
    
    json[keys[buildType]] = json[keys[buildType]] || [];
    let subPackages = [];
    try {
        appRootConfig = require( path.join(process.cwd(), `${buildType}Config.json`) );
        subPackages = appRootConfig.subpackages || appRootConfig.subPackages;
    } catch (err) {
       
    }

    let routes = json.pages.slice();
    subPackages.forEach(function(el){
        let {name, resource} = el;
        let subPackagesItem = {
            root: resource,
            name: name,
            pages:[]
        };
        let reg = new RegExp('^' + resource);
        json[keys[buildType]].push(subPackagesItem);
        json.pages.forEach(function(pageRoute){
            if (reg.test(pageRoute)) {
                let _index = routes.indexOf(pageRoute);
                let subPage = routes.splice(_index, 1)[0];
                subPackagesItem.pages.push(  subPage.replace(resource + '/', '') );
            }
        });
        
    });
    if (!json[keys[buildType]].length) {
        delete json[keys[buildType]];
    }
    json.pages = routes;
    
    return json;
}