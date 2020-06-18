"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const cwd = process.cwd();
const merge = require('lodash.mergewith');
const shelljs = require('shelljs');
const mergeDir = path.join(cwd, '.CACHE/nanachi');
let mergeFilesQueue = require('./mergeFilesQueue');
let diff = require('deep-diff');
const buildType = process.argv[2].split(':')[1];
const ignoreExt = ['.tgz'];
const ANU_ENV = buildType
    ? buildType === 'h5'
        ? 'web'
        : buildType
    : 'wx';
function getMergedAppJsConent(appJsSrcPath, pages = [], importSyntax = []) {
    function getAppImportSyntaxCode(importSyntax = []) {
        let importSyntaxList = importSyntax.map(function (curEl) {
            curEl = curEl.trim();
            if (!/;$/.test(curEl)) {
                curEl = curEl + ';';
            }
            return curEl;
        });
        return importSyntaxList.length ? importSyntaxList.join("\n") + '\n' : '';
    }
    let allRoutesStr = pages.map(function (pageRoute) {
        if (!(/^\.\//.test(pageRoute))) {
            pageRoute = './' + pageRoute;
        }
        pageRoute = `import '${pageRoute}';\n`;
        return pageRoute;
    }).join('');
    allRoutesStr += getAppImportSyntaxCode(importSyntax);
    return new Promise(function (rel, rej) {
        let appJsSrcContent = '';
        let appJsDist = path.join(mergeDir, 'source', 'app.js');
        try {
            appJsSrcContent = fs.readFileSync(appJsSrcPath).toString();
        }
        catch (err) {
            rej(err);
        }
        appJsSrcContent = allRoutesStr + appJsSrcContent;
        rel({
            content: appJsSrcContent,
            dist: appJsDist
        });
    });
}
function getAppJsSourcePath(queue = []) {
    let appJsSourcePath = queue.filter(function (file) {
        file = file.replace(/\\/g, '/');
        return /\/app\.js$/.test(file);
    })[0];
    return appJsSourcePath;
}
function getFilesMap(queue = []) {
    let map = {};
    let env = ANU_ENV;
    queue.forEach(function (file) {
        file = file.replace(/\\/g, '/');
        if (/\/package\.json$/.test(file)) {
            let { dependencies = {}, devDependencies = {} } = require(file);
            if (dependencies) {
                delete dependencies['@qnpm/chaika-patch'];
                map['pkgDependencies'] = map['pkgDependencies'] || [];
                map['pkgDependencies'].push({
                    id: file,
                    content: dependencies,
                    type: 'dependencies'
                });
            }
            if (devDependencies) {
                delete devDependencies['node-sass'];
                delete devDependencies['@qnpm/chaika-patch'];
                map['pkgDevDep'] = map['pkgDevDep'] || [];
                map['pkgDevDep'].push({
                    id: file,
                    content: devDependencies,
                    type: 'devDependencies'
                });
            }
            return;
        }
        if (/\/app\.json$/.test(file)) {
            var { alias = {}, pages = [], imports = [], order = 0 } = require(file);
            if (alias) {
                map['alias'] = map['alias'] || [];
                map['alias'].push({
                    id: file,
                    content: alias,
                    type: 'alias'
                });
            }
            if (pages.length) {
                let allInjectRoutes = pages.reduce(function (ret, route) {
                    let injectRoute = '';
                    if ('[object Object]' === Object.prototype.toString.call(route)) {
                        var supportPlat = route.platform.replace(/\s*/g, '').split(',');
                        if (supportPlat.includes(env)) {
                            injectRoute = route.route;
                        }
                    }
                    else {
                        injectRoute = route;
                    }
                    if (injectRoute) {
                        ret.add(injectRoute);
                    }
                    return ret;
                }, new Set());
                map['pages'] = map['pages'] || [];
                map['pages'].push({
                    routes: Array.from(allInjectRoutes),
                    order: order
                });
            }
            map['importSyntax'] = map['importSyntax'] || [];
            map['importSyntax'] = map['importSyntax'].concat(imports);
            return;
        }
        if (/\/project\.config\.json$/.test(file)) {
            map['projectConfigJson'] = map['projectConfigJson'] || [];
            map['projectConfigJson'].push(file);
            return;
        }
        var reg = new RegExp(env + 'Config.json$');
        map['xconfig'] = map['xconfig'] || [];
        if (reg.test(file)) {
            try {
                var config = require(file);
                if (config) {
                    map['xconfig'].push({
                        id: file,
                        content: config
                    });
                }
            }
            catch (err) {
            }
        }
    });
    map = orderRouteByOrder(map);
    return map;
}
function orderRouteByOrder(map) {
    map['pages'] = map['pages'].sort(function (a, b) {
        return b.order - a.order;
    });
    map['pages'] = map['pages'].map(function (pageEl) {
        return pageEl.routes;
    });
    map['pages'] = [].concat(...map['pages']);
    return map;
}
function customizer(objValue, srcValue) {
    if (Array.isArray(objValue)) {
        return Array.from(new Set(objValue.concat(srcValue)));
    }
}
function getUniqueSubPkgConfig(list = []) {
    return list.reduce(function (initList, curEle) {
        let curName = curEle.name;
        let hasEle = initList.some(function (el) {
            return el.name === curName;
        });
        if (!hasEle)
            initList.push(curEle);
        return initList;
    }, []);
}
function getMergedXConfigContent(config) {
    let env = ANU_ENV;
    let xConfigJsonDist = path.join(mergeDir, 'source', `${env}Config.json`);
    let ret = xDiff(config);
    for (let i in ret) {
        if (i.toLocaleLowerCase() === 'subpackages') {
            ret[i] = getUniqueSubPkgConfig(ret[i]);
        }
    }
    return Promise.resolve({
        dist: xConfigJsonDist,
        content: JSON.stringify(ret, null, 4)
    });
}
function getMergedData(configList) {
    return xDiff(configList);
}
function getValueByPath(path, data) {
    path = path.slice(0);
    var ret;
    while (path.length) {
        var key = path.shift();
        if (!ret) {
            ret = data[key] || '';
        }
        else {
            ret = ret[key] || '';
        }
    }
    return ret;
}
function xDiff(list) {
    if (!list.length)
        return {};
    let first = list[0];
    let confictQueue = [];
    let other = list.slice(1);
    let isConfict = false;
    for (let i = 0; i < other.length; i++) {
        let x = diff(first.content, other[i].content) || [];
        x = x.filter(function (el) {
            return el.kind === 'E'
                && el.path.every(function (el) {
                    return typeof el === 'string';
                });
        });
        if (x.length) {
            isConfict = true;
            confictQueue = [...x];
            break;
        }
    }
    if (isConfict) {
        var errList = [];
        confictQueue.forEach(function (confictEl) {
            let kind = [];
            list.forEach(function (el) {
                let confictValue = getValueByPath(confictEl.path, el.content);
                if (confictValue) {
                    let errorItem = {};
                    errorItem.confictFile = el.id.replace(/\\/g, '/').split(/\/download\//).pop();
                    errorItem.confictValue = confictValue || '';
                    if (el.type === 'dependencies') {
                        errorItem.confictKeyPath = ['dependencies', ...confictEl.path];
                    }
                    else if (el.type === 'devDependencies') {
                        errorItem.confictKeyPath = ['devDependencies', ...confictEl.path];
                    }
                    else if (el.type === 'alias') {
                        errorItem.confictKeyPath = ['nanachi', 'alias', ...confictEl.path];
                    }
                    else {
                        errorItem.confictKeyPath = confictEl.path;
                    }
                    errorItem.confictKeyPath = JSON.stringify(errorItem.confictKeyPath);
                    kind.push(errorItem);
                }
            });
            errList.push(kind);
        });
        var msg = '';
        errList.forEach(function (errEl) {
            let kindErr = '';
            errEl.forEach(function (errItem) {
                var tpl = `
冲突文件: ${(errItem.confictFile)}
冲突路径 ${errItem.confictKeyPath}
冲突详情：${JSON.stringify({ [JSON.parse(errItem.confictKeyPath).pop()]: errItem.confictValue }, null, 4)}
`;
                kindErr += tpl;
            });
            msg = msg + kindErr + '\n--------------------------------------------------\n';
        });
        console.log(chalk.bold.red('⚠️  发现冲突! 请先解决冲突。\n\n' + msg));
        process.exit(1);
    }
    isConfict = false;
    if (!isConfict) {
        return list.reduce(function (ret, el) {
            return merge(ret, el.content, customizer);
        }, {});
    }
    else {
        return {};
    }
}
function getMergedPkgJsonContent(alias) {
    let currentPkg = require(path.join(cwd, 'package.json'));
    let distContent = Object.assign({}, currentPkg, {
        nanachi: {
            alias: alias
        }
    });
    let dist = path.join(mergeDir, 'package.json');
    return {
        dist: dist,
        content: JSON.stringify(distContent, null, 4)
    };
}
function getMiniAppProjectConfigJson(projectConfigQueue = []) {
    let dist = path.join(mergeDir, 'project.config.json');
    let distContent = '';
    if (projectConfigQueue.length) {
        distContent = JSON.stringify(require(projectConfigQueue[0]), null, 4);
    }
    return {
        dist: dist,
        content: distContent
    };
}
function validateAppJsFileCount(queue) {
    let appJsFileCount = queue
        .filter(function (el) {
        return /\/app\.js$/.test(el);
    })
        .map(function (el) {
        return el.replace(/\\/g, '/').split('/download/').pop();
    });
    if (!appJsFileCount.length || appJsFileCount.length > 1) {
        let msg = '';
        if (!appJsFileCount.length) {
            msg = '校验到无 app.js 文件的拆库工程，请检查是否安装了该包含 app.js 文件的拆库工程.';
        }
        else if (appJsFileCount.length > 1) {
            msg = '校验到多个拆库仓库中存在app.js. 在业务线的拆库工程中，有且只能有一个拆库需要包含app.js' + '\n' + JSON.stringify(appJsFileCount, null, 4);
        }
        console.log(chalk.bold.red(msg));
        process.exit(1);
    }
}
function validateMiniAppProjectConfigJson(queue) {
    let projectConfigJsonList = queue.filter(function (el) {
        return /\/project\.config\.json$/.test(el);
    });
    if (projectConfigJsonList.length > 1) {
        console.log(chalk.bold.red('校验到多个拆库仓库中存在project.config.json. 在业务线的拆库工程中，最多只能有一个拆库需要包含project.config.jon:'), chalk.bold.red('\n' + JSON.stringify(projectConfigJsonList, null, 4)));
        process.exit(1);
    }
}
function validateConfigFileCount(queue) {
    let configFiles = queue.filter(function (el) {
        return /Config\.json$/.test(el);
    });
    let errorFiles = [];
    configFiles.forEach(function (el) {
        el = el.replace(/\\/g, '/');
        let projectName = el.replace(/\\/g, '/').split('/download/')[1].split('/')[0];
        let reg = new RegExp(projectName + '/' + ANU_ENV + 'Config.json$');
        let dir = path.dirname(el);
        if (reg.test(el) && !fs.existsSync(path.join(dir, 'app.js'))) {
            errorFiles.push(el);
        }
    });
    if (errorFiles.length) {
        console.log(chalk.bold.red('⚠️   校验到拆库仓库中配置文件路径错误，请将该配置文件放到  source 目录中:'));
        console.log(chalk.bold.red(errorFiles.join('\n')) + '\n');
        process.exit(1);
    }
}
function default_1() {
    let queue = Array.from(mergeFilesQueue);
    validateAppJsFileCount(queue);
    validateConfigFileCount(queue);
    validateMiniAppProjectConfigJson(queue);
    let map = getFilesMap(queue);
    let tasks = [
        getMergedAppJsConent(getAppJsSourcePath(queue), map.pages, map.importSyntax),
        getMergedXConfigContent(map.xconfig),
        getMergedPkgJsonContent(getMergedData(map.alias)),
        getMiniAppProjectConfigJson(map.projectConfigJson)
    ];
    function getNodeModulesList(config) {
        let mergeData = getMergedData(config);
        return Object.keys(mergeData).reduce(function (ret, key) {
            ret.push(key + '@' + mergeData[key]);
            return ret;
        }, []);
    }
    var installList = [...getNodeModulesList(map.pkgDependencies), ...getNodeModulesList(map.pkgDevDep)];
    installList = Array.from(new Set(installList));
    if (ANU_ENV !== 'quick') {
        installList = installList.filter((dep) => {
            return !/hap\-toolkit/.test(dep);
        });
    }
    else {
        const hapToolKitVersion = process.env.hapToolKitVersion;
        installList = installList.map((dep) => {
            if (/hap\-toolkit/.test(dep) && hapToolKitVersion) {
                dep = `hap-toolkit@${hapToolKitVersion}`;
            }
            return dep;
        });
    }
    if (process.env.JENKINS_URL) {
        const blockList = ['babel-eslint', 'eslint', 'eslint-plugin-react', 'pre-commit', 'chokidar', 'shelljs'];
        installList = installList.filter((dep) => {
            const depLevel = dep.split('@');
            const depName = depLevel[0] ? depLevel[0] : depLevel[1];
            return !blockList.includes(depName);
        });
    }
    var installPkgList = installList.reduce(function (needInstall, pkg) {
        var pkgMeta = pkg.split('@');
        var pkgName = pkgMeta[0] === '' ? '@' + pkgMeta[1] : pkgMeta[0];
        var p = path.join(cwd, 'node_modules', pkgName, 'package.json');
        var isExit = fs.existsSync(p);
        if (!isExit) {
            needInstall.push(pkg);
        }
        return needInstall;
    }, []);
    installPkgList = installPkgList.filter(function (dep) {
        return !ignoreExt.includes('.' + dep.split('.').pop());
    });
    if (installPkgList.length) {
        let installList = installPkgList.join(' ');
        let installListLog = installPkgList.join('\n');
        fs.ensureDir(path.join(cwd, 'node_modules'));
        const npmRegistry = process.env.npmRegistry;
        let cmd = '';
        let installMsg = '';
        if (npmRegistry) {
            cmd = `npm install ${installList} --no-save --registry=${npmRegistry}`;
            installMsg = `🚚 正在从 ${npmRegistry} 安装拆库依赖, 请稍候...\n${installListLog}`;
        }
        else {
            cmd = `npm install ${installList} --no-save`;
            installMsg = `🚚 正在安装拆库依赖, 请稍候...\n${installListLog}`;
        }
        console.log(chalk.bold.green(installMsg));
        let std = shelljs.exec(cmd, {
            silent: false
        });
        if (/npm ERR/.test(std.stderr)) {
            console.log(chalk.red(std.stderr));
            process.exit(1);
        }
    }
    return Promise.all(tasks)
        .then(function (queue) {
        queue = queue.map(function ({ dist, content }) {
            return new Promise(function (rel, rej) {
                if (!content) {
                    rel(1);
                    return;
                }
                fs.ensureFileSync(dist);
                fs.writeFile(dist, content, function (err) {
                    if (err) {
                        rej(err);
                    }
                    else {
                        rel(1);
                    }
                });
            });
        });
        return Promise.all(queue);
    });
}
exports.default = default_1;
;
