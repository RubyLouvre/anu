"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require('fs-extra');
const path = __importStar(require("path"));
const cwd = process.cwd();
const chalk = require('chalk');
const globalConfig = require('../../config/config');
function writeWebViewConfig(routes) {
    let { allowthirdpartycookies, trustedurl } = globalConfig.WebViewRules;
    let ret = {};
    for (let key in routes) {
        ret[key] = {
            src: routes[key],
            allowthirdpartycookies: allowthirdpartycookies,
            trustedurl: trustedurl
        };
    }
    let code = `module.exports = ${JSON.stringify(ret)};`;
    let filePath = path.join(cwd, 'src', 'webviewConfig.js');
    fs.ensureFileSync(filePath);
    fs.writeFileSync(filePath, code);
}
function getWebViewRoutes(routes) {
    let ret = {}, pkg = null, host = '';
    try {
        pkg = require(path.join(cwd, 'package.json'));
    }
    catch (err) {
    }
    if (pkg.nanachi && pkg.nanachi.H5_HOST) {
        host = pkg.nanachi.H5_HOST;
    }
    if (!host) {
        console.log(chalk.red('Error: H5请在package.json中nanachi字段里配置H5_HOST字段'));
        process.exit(1);
    }
    routes.forEach((el) => {
        let route = path.relative(path.join(cwd, 'source'), el.id).replace(/\.js$/, '');
        ret[route] = host + '/' + route;
    });
    return ret;
}
function writeWebViewContainer() {
    let src = path.join(__dirname, '../quickHelpers/WebViewPageWrapper.ux');
    let dist = path.join(cwd, '/src/pages/__web__view__/index.ux');
    fs.copy(src, dist, function (err) {
        if (err) {
            console.log(err);
        }
    });
}
function writeH5CompileConfig(routes) {
    let H5_COMPILE_JSON_FILE = path.join(cwd, 'source', 'H5_COMPILE_CONFIG.json');
    fs.ensureFileSync(H5_COMPILE_JSON_FILE);
    fs.writeFileSync(H5_COMPILE_JSON_FILE, JSON.stringify({
        webviewPages: routes.map((el) => {
            return el.id;
        })
    }));
}
function deleteWebViewConifg() {
    let list = [
        'H5_COMPILE_CONFIG.json',
        'webviewConfig.js'
    ];
    list = list.map((file) => {
        return path.join(cwd, 'source', file);
    });
    list.forEach((fileId) => {
        try {
            fs.removeSync(fileId);
        }
        catch (err) { }
    });
}
function writeManifest(webViewRoutes) {
    let manifestPath = path.join(cwd, 'src', 'manifest.json');
    let originManifest = require(manifestPath);
    let webViewRoutesAry = Object.keys(webViewRoutes).map(function (route) {
        return route.replace(/\\/g, '/').replace(/\/index$/, '');
    });
    for (let i in originManifest.router.pages) {
        if (webViewRoutesAry.includes(i)) {
            delete originManifest.router.pages[i];
        }
    }
    let routePath = 'pages/__web__view__';
    originManifest.router.pages[routePath] = {
        component: 'index'
    };
    if (!globalConfig.WebViewRules.showTitleBar) {
        let routePath = 'pages/__web__view__';
        let display = originManifest.display || {};
        display.pages = display.pages || {};
        display.pages[routePath] = {
            titleBar: false
        };
    }
    fs.writeFileSync(manifestPath, JSON.stringify(originManifest, null, 4));
}
module.exports = function (routes = []) {
    if (!routes.length) {
        return;
    }
    let webViewRoutes = getWebViewRoutes(routes);
    deleteWebViewConifg();
    writeH5CompileConfig(routes);
    writeWebViewContainer();
    writeWebViewConfig(webViewRoutes);
    writeManifest(webViewRoutes);
};
