const buildType = process.env.ANU_ENV;
const supportPlat = ['wx', 'bu', 'qq', 'ali'];
const keys = {
    ali: 'subPackages',
    bu: 'subPackages',
    wx: 'subpackages',
    qq: 'subpackages'
};
const getSubpackage = require('./getSubPackage');
module.exports = function (modules, json) {
    if (modules.componentType !== 'App') {
        return json;
    }
    if (!supportPlat.includes(buildType)) {
        return json;
    }
    if (!json.pages)
        return json;
    json[keys[buildType]] = json[keys[buildType]] || [];
    const subPackages = getSubpackage(buildType);
    let routes = json.pages.slice();
    subPackages.forEach(function (el) {
        let { name, resource } = el;
        let subPackagesItem = {
            root: resource,
            name: name,
            pages: []
        };
        if (buildType === 'ali') {
            delete subPackagesItem.name;
        }
        let reg = new RegExp('^' + resource);
        json[keys[buildType]].push(subPackagesItem);
        json.pages.forEach(function (pageRoute) {
            if (reg.test(pageRoute)) {
                let _index = routes.indexOf(pageRoute);
                let subPage = routes.splice(_index, 1)[0];
                subPackagesItem.pages.push(subPage.replace(resource + '/', ''));
            }
        });
    });
    if (!json[keys[buildType]].length) {
        delete json[keys[buildType]];
    }
    json.pages = routes;
    return json;
};
