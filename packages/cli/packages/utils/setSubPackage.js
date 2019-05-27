
//分包配置
const path = require('path');
const buildType = process.env.ANU_ENV;
const supportPlat = ['wx', 'bu', 'qq', 'ali'];
const keys = {
    ali: 'subPackages',
    bu: 'subPackages',
    wx: 'subpackages',
    qq: 'subpackages'
};
module.exports = function(modules, json) {
    if (modules.componentType !== 'App') {
        return json;
    }
    if (!supportPlat.includes(buildType)) {
        return json;
    }
    

    if (!json.pages) return json;

    json[keys[buildType]] = json[keys[buildType]] || [];
    let subPackages = [];
    try {
        appRootConfig = require( path.join(process.cwd(), 'source', `${buildType}Config.json`) );
        subPackages = appRootConfig.subpackages || appRootConfig.subPackages || [];
    } catch (err) {
       
    }

    let routes = json.pages.slice();
    /**
     * subPackages: [
     *      {
     *          "name": "native",
     *          "resource": "pages/demo/native"
     *      }
     * ]
     */
    subPackages.forEach(function(el){
        let {name, resource} = el;
        /**
         * subPackagesItem: [
         *     root: "pages/demo/native",
         *     name: "native",
         *     pages: ["await/index", "loop/index"]
         * ]
         */
        let subPackagesItem = {
            root: resource,
            name: name,
            pages:[]
        };

        if (buildType === 'ali') {
            delete subPackagesItem.name;
        }

        //核心是根据配置中的 resource 创建正则，去遍历出 pages 中的的匹配这个正则的路由。
        let reg = new RegExp('^' + resource);
        json[keys[buildType]].push(subPackagesItem);
        json.pages.forEach(function(pageRoute){
            if (reg.test(pageRoute)) {
                let _index = routes.indexOf(pageRoute);

                //如果匹配到分包，需要从 pages 中将分包的路径删除掉
                let subPage = routes.splice(_index, 1)[0];

                // pages/demo/syntax/multiple/index => multiple/index
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