"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require('path');
const fs = require('fs');
const id = 'SizePlugin';
const table = require('table').table;
function flatten(ary) {
    var ret = [];
    ary.map(function (el) {
        if (Array.isArray(el)) {
            ret = ret.concat(el);
        }
        else {
            ret.push(el);
        }
    });
    return ret;
}
function getSize(ary) {
    let defaultSize = 0;
    ary.forEach(function (el) {
        defaultSize += el.size;
    });
    return defaultSize;
}
class SizePlugin {
    apply(compiler) {
        compiler.hooks.done.tap(id, (compilation) => {
            var map = {}, tree = {}, pages = [], Identifiers = {};
            var assetsInfo = compilation.toJson().assets;
            compilation.toJson().modules.forEach(function (module) {
                if (/\/node_modules\//.test(module.id.toString())) {
                    return;
                }
                let fileId = module.id.toString().split(/\/source\//)[1];
                if (/(pages|app)\/?/.test(fileId) && /\.js$/.test(fileId)) {
                    pages.push(fileId);
                }
                var reasons = module.reasons
                    .map(function (el) {
                    if (el.moduleId) {
                        return el.moduleId.split(/\/source\//)[1];
                    }
                    else {
                        return '';
                    }
                });
                reasons = Array.from(new Set(reasons));
                if (reasons.length > 1) {
                    Identifiers[fileId] = 1;
                }
                else {
                    Identifiers[fileId] = 0;
                }
                map[fileId] = {
                    id: fileId,
                    reasons: reasons,
                    assets: module.assets
                };
            });
            pages.forEach(function (pagePath) {
                for (let i in map) {
                    if (map[i].reasons.includes(pagePath)) {
                        tree[pagePath] = tree[pagePath] || [];
                        tree[pagePath].push(i);
                        if (!tree[pagePath].includes(pagePath)) {
                            tree[pagePath].push(pagePath);
                        }
                    }
                }
            });
            let ret = {};
            fs.readdirSync(path.join(process.cwd(), 'source', 'pages'))
                .filter(function (el) {
                return /^\w+/.test(el);
            })
                .forEach(function (plat) {
                ret[plat] = {
                    plat: plat,
                    dep: [],
                    common: []
                };
            });
            for (let i in tree) {
                let fileDeps = tree[i].map(function (dep) {
                    var depAssets = map[dep].assets;
                    return depAssets.map(function (el) {
                        let target = assetsInfo.find(function (item) {
                            return item.name == el;
                        });
                        return {
                            name: target.name,
                            size: target.size,
                            onwer: dep
                        };
                    });
                });
                fileDeps = flatten(fileDeps);
                if (!/app\.js/.test(i)) {
                    let plat = i.split('/')[1];
                    ret[plat].dep = ret[plat].dep.concat(fileDeps);
                }
                else {
                    fileDeps = fileDeps.filter(function (el) {
                        return !/^pages\//.test(el.name) && !/React\w+\.js$/.test(el.name);
                    });
                    ret.app = ret.app || {
                        plat: 'app',
                        dep: [].concat(fileDeps)
                    };
                }
            }
            let output = [];
            for (let plat in ret) {
                let dep = ret[plat].dep, tem = [], commonFiles = [], files = [];
                dep = dep.filter(function (el) {
                    return !/React\w+\.js$/.test(el.name);
                });
                dep.forEach(function (el) {
                    if (Identifiers[el.name] == 1) {
                        commonFiles.push(el);
                    }
                    if (/React\w+\.js$/.test(el.name)) {
                        if (!tem.length) {
                            tem.push(el);
                        }
                    }
                    else {
                        files.push(el);
                    }
                });
                files = files.concat(tem);
                let tableItem = [];
                let allSize = (getSize(files) / 1000).toFixed(2);
                let commonPercent = +(getSize(commonFiles) / 1000).toFixed(2) / allSize;
                commonPercent = +commonPercent.toFixed(2) * 100;
                tableItem.push(plat, Math.round(+(getSize(files) / 1000).toFixed(2)) + ' Kb', commonPercent + ' %');
                output.push(tableItem);
            }
            var data = [
                ['业务平台', 'size', '公共资源占比']
            ].concat(output);
            console.log(table(data));
        });
    }
}
exports.default = SizePlugin;
