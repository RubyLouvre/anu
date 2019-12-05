/*!
快应用不支持 类属性， 只好将它抽出来放到类名后面
并且针对app要做一些转换

*/
import * as path from 'path';
import platConfig from '../../config/config';

//默认manifest.json
var manifest: any = {
    package: 'org.hapjs.demo.sample',
    name: 'nanachi转快应用',
    versionName: '1.0.0',
    versionCode: 1,
    minPlatformVersion: 1030,
    icon: '/assets/logo.png',
    features: [
        { name: 'system.webview' },
        { name: 'system.prompt' },
        { name: 'system.clipboard' },
        { name: 'system.calendar' },
        { name: 'system.device' },
        { name: 'system.fetch' },
        { name: 'system.file' },
        { name: 'system.geolocation' },
        { name: 'system.image' },
        { name: 'system.media' },
        { name: 'system.notification' },
        { name: 'system.barcode' },
        { name: 'system.sensor' },
        { name: 'system.share' },
        { name: 'system.shortcut' },
        { name: 'system.storage' },
        { name: 'system.vibrator' },
        { name: 'system.network' },
        { name: 'system.request' },
        { name: 'system.audio' },
        { name: 'system.volume' },
        { name: 'system.battery' },
        { name: 'system.brightness' },
        { name: 'system.package' },
        { name: 'system.record' },
        { name: 'system.sms' },
        { name: 'system.websocketfactory' },
        { name: 'system.wifi' },
        { name: 'service.stats' },
        { name: 'service.account' },
        { name: 'system.contact'},
        { name: 'service.app' },
        { name: 'service.share', 'params': {'appSign': '', 'wxKey': ''} },
        { name: 'service.pay' },
        { name: 'service.alipay' },
        {
            name: 'service.wxpay',
            'params': {
                'url': '',
                'package': '',
                'sign': ''
            }
        },
        {
            name: 'service.push',
            'params': {
                'appId': '',
                'appKey': ''
            }
        },
        {
            name: 'service.wxaccount',
            'params': {
                'appId': '',
                'package': '',
                'sign': ''
            }
        },
        {
            name: 'service.qqaccount',
            'params': {
                'package':'',
                'appId': '',
                'sign': '',
                'clientId':''
            }
        },
        {
            name: 'service.wbaccount',
            'params': {
                'sign': '',
                'appKey': ''
            }
        }
    ],
    permissions: [
        { origin: '*' }
    ],
    config: {
        logLevel: 'debug',
        data: {
            back: false
        }
    },
    router: {
        entry: 'pages/index',
        pages: {
           
        }
    },
    display: {
        menu: true,
        titleBar: true,
        titleBarBackgroundColor: "#ffffff"
    },
    subpackages: []
      
};


//配置页面路由
function setRouter(config: any) {


    config.pages.forEach(function(el: any ,index: number){
        
        var routePath = el.slice(0, -6);
        manifest.router.pages[routePath] = {
            component: 'index'
        };
        //设置首页
        if (index === 0){
            manifest.router.entry = routePath;
        } 
    });
  
    //webview路由跳转
    var globalConfig = require('../../config/config');
    if (globalConfig.webview && globalConfig.webview.pages.length) {
        let routePath = 'pages/__web__view__';
        manifest.router.pages[routePath] = {
            component: 'index'
        }
    }

    let userConfig: any = {};
    try {
        userConfig = require(path.join(process.cwd(), 'source', 'quickConfig.json'));
        
    } catch (err) {
        // eslint-disable-next-line
    }

    if (
        userConfig.router 
        && Object.prototype.toString.call(userConfig.router) === '[object Object]'
    ) 
    {
        let pages = {};
        if (userConfig.router.entry) {
            // 不允许用户配置router.entry
            delete userConfig.router.entry;
        }
        if (platConfig.huawei && userConfig.router.pages && Object.prototype.toString.call(userConfig.router.pages) === '[object Object]') {
            // 合并router.pages
            pages = Object.assign({}, manifest.router && manifest.router.pages, userConfig.router.pages);
        } else {
            // 如果不是华为，删除用户自己配置的router.pages字段
            delete userConfig.router.pages;
        }
        Object.assign(manifest.router, userConfig.router);
        Object.assign(manifest.router.pages, pages);
    }
    if (
        platConfig.huawei
        && userConfig.widgets 
        && Object.prototype.toString.call(userConfig.widgets) === '[object Array]'
    ) 
    {
        manifest.widgets = userConfig.widgets
    }

}


//为app.js的config对象配置titlebar
function setTitleBar(config: any) {
    var display = manifest.display;
    let userConfig: any = {};
    try {
        userConfig = require(path.join(process.cwd(), 'source', 'quickConfig.json'));
    } catch (err) {
        // eslint-disable-next-line
    }

    //webview配置titlebar
    var globalConfig = require('../../config/config');

    if ( globalConfig.webview 
        && /true|false/.test(globalConfig.webview.showTitleBar)
        && !globalConfig.webview.showTitleBar ) {
        let routePath = 'pages/__web__view__';
        display['pages'] = display['pages'] || {};
        display['pages'][routePath] = {
            titleBar: false
        }
    }
    
    if (
        userConfig.display 
        && /true|false/.test(userConfig.display.titleBar)
        && !userConfig.display.titleBar
    ) 
    {
        display.titleBar = false;
        return;
    }

    
    //这里取得 app.js 类的config.window 得值，但是 pageWrapper又是取得config的值。造成必须两者都要写
    var win = config.window || {};
    //从config
    var disabledTitleBarPages = globalConfig.quick.disabledTitleBarPages || []
    disabledTitleBarPages.forEach(function(el: any){
        // userPath/titledemo/source/pages/index/index.js => pages/index/index
        let route = path.relative( path.join(process.cwd(), platConfig.sourceDir),  path.dirname(el) );
        display.pages = display.pages || {};
        display['pages'][route] = display['pages'][route] || {};
        display['pages'][route]['titleBar'] = false;
    });
    
    display.titleBarText = win.navigationBarTitleText || 'nanachi';
    display.titleBarTextColor = win.navigationBarTextStyle || 'black';
    //快应用的display.backgroundColor 颜色又是取得win.navigationBarBackgroundColor导航栏背景的颜色，
    //应该取win.backgroundColor窗口背景的颜色
    //如果少了个display.titleBarBackgroundColor 会导致页面切换出现黑色闪屏
    display.titleBarBackground = win.navigationBarBackgroundColor || '#ffffff';
    display.backgroundColor = win.backgroundColor || '#ffffff';

}

//配置name, permissions, config, subpackages, 各支付签名
function setOtherConfig() {
    let userConfig: any = {};
    try {
        userConfig = require(path.join(process.cwd(), 'source', 'quickConfig.json'));
    } catch (err) {
        // eslint-disable-next-line
    }

    if (
        userConfig.display 
        && /true|false/.test(userConfig.display.menu)
        && !userConfig.display.menu
    ) 
    {
        manifest.display.menu = false;
    }
   
    //配置各支付签名
    let userFeatures = userConfig.features || [];
    let features = manifest.features.map(function(el: any){
        let userFeat = userFeatures.find(function(userFeat: any){
            return userFeat.name === el.name;
        });
        return userFeat ? userFeat : el;
    });
    
    manifest.features = features;
    [
        'name', 
        'versionName',
        'versionCode',
        'permissions', 
        'config', 
        'subpackages',
        'package',
        'minPlatformVersion',
        'icon'
    ].forEach(function(el){
        if (userConfig[el]) {
            manifest[el] = userConfig[el];
        }
    });
}


module.exports = function quickConfig(config: any, modules: any){
    if (modules.componentType !== 'App') return;
   
    //配置页面路由
    setRouter(config);

    //配置titlebar
    setTitleBar(config);
    if (platConfig.huawei){
        manifest.minPlatformVersion = 1040;
    }
    //配置name, permissions, config, subpackages, 各支付签名
    setOtherConfig();
    //manifest要序列化的对象
    modules.queue.push({
        path: 'manifest.json',
        code: JSON.stringify(manifest, null, 4),
        type: 'json'
    });

    var win = config.window;
    delete config.window;
    delete config.pages;
    Object.assign(config, win);
    return;
};