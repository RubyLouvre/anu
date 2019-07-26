const fs = require('fs-extra');
import * as path from 'path';
const cwd = process.cwd();
const chalk = require('chalk');
const globalConfig = require('../../config/config');

/**
 * @param {Object} routes webview化页面路径的对应的 HTTP URL 路径表.
 * 如 { 'pages/syntax/await/index' : 'http://127.0.0.1/pages/syntax/await/index'}
 */
function writeWebViewConfig(routes: {
    [props: string]: string;
}) {
    let { allowthirdpartycookies, trustedurl } = globalConfig.WebViewRules;
    /**
     * ret {
     *    'pages/syntax/multiple/index': { 
     *          src: 'http://127.0.0.1/pages/syntax/multiple/index',
     *          allowthirdpartycookies: false,
     *          trustedurl: [] 
     *     }
     * }
     */
    let ret:{
        [props: string]: {
            src: string;
            allowthirdpartycookies: boolean;
            trustedurl: Array<string>;
        };
    } = {};
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
    fs.writeFileSync( filePath, code );
}

//获取 H5 路由配置
function getWebViewRoutes(routes: any) {
    let ret: any = {},
        pkg = null,
        host = '';
    try {
        pkg = require(path.join(cwd, 'package.json'));
    } catch (err) {

    }
    if (pkg.nanachi && pkg.nanachi.H5_HOST ) {
        host = pkg.nanachi.H5_HOST;
    }

    if (!host) {
        console.log(chalk.red('Error: H5请在package.json中nanachi字段里配置H5_HOST字段'));
        process.exit(1);
    }
    routes.forEach((el: any) => {
        let route = path.relative(path.join(cwd, 'source'), el.id).replace(/\.js$/, '');
        ret[route] = host + '/' + route;

    });
    return ret;
}

function writeWebViewContainer(){
    let src = path.join(__dirname, '../quickHelpers/WebViewPageWrapper.ux');
    let dist = path.join(cwd, '/src/pages/__web__view__/index.ux');
    fs.copy(src, dist, function(err: Error){
        if (err) {
            console.log(err);
        }
    });
}

//配置 H5_COMPILE_CONFIG.json, H5编译读该文件路由配置进行按需编译。
function writeH5CompileConfig(routes: any) {
    let H5_COMPILE_JSON_FILE = path.join(cwd, 'source', 'H5_COMPILE_CONFIG.json');
    fs.ensureFileSync(H5_COMPILE_JSON_FILE);
    fs.writeFileSync(
        H5_COMPILE_JSON_FILE,
        JSON.stringify({
            webviewPages: routes.map((el: any) => {
                return el.id;
            })
        })
    );
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
        } catch (err) {}
    });

}

/**
 * 该函数会 manifest.json 中写入 pages/__web__view__ 路由，所有webiew跳转都通过 pages/__web__view__ 页面来代理。
 * @param {Object} webViewRoutes webview化的路由映射
 */
function writeManifest(webViewRoutes: any){
    
    let manifestPath = path.join(cwd, 'src', 'manifest.json');
    let originManifest = require(manifestPath);

    let webViewRoutesAry: any = Object.keys(webViewRoutes).map(function(route){
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
  
    // 可自定义渲染 WEBVIEW 时是否显示titlebar
    if ( !globalConfig.WebViewRules.showTitleBar ) {
        let routePath = 'pages/__web__view__';
        let display = originManifest.display || {};
        display.pages = display.pages || {};
        display.pages[routePath] = {
            titleBar: false
        };
    }
    fs.writeFileSync(manifestPath, JSON.stringify(originManifest, null, 4));
}

module.exports = function(routes: Array<any> = []){
    if (!routes.length) {
        return;
    }
    let webViewRoutes: any = getWebViewRoutes(routes);
   
    //每次build先删除配置文件
    deleteWebViewConifg();

    //注入h5编译route配置
    writeH5CompileConfig(routes);

    writeWebViewContainer();

    //注入运行时 webview 各route 运行时配置
    writeWebViewConfig(webViewRoutes);
     
    writeManifest(webViewRoutes);
};