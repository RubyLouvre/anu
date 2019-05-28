/*!
快应用不支持 类属性， 只好将它抽出来放到类名后面
并且针对app要做一些转换

*/
const path = require('path');
const platConfig = require('../../config/config');

//默认manifest.json
var manifest = {
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
        titleBar: true
    },
    subpackages: []
      
};


//配置页面路由
function setRouter(config) {


    config.pages.forEach(function(el ,index){
        
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

    let userConfig = {};
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
        Object.assign(manifest.router, userConfig.router);
    }

}


//配置titlebar
function setTitleBar(config) {
    var display = manifest.display;
    let userConfig = {};
    try {
        userConfig = require(path.join(process.cwd(), 'source', 'quickConfig.json'));
    } catch (err) {
        // eslint-disable-next-line
    }
    
    if (
        userConfig.display 
        && Object.prototype.toString.call(userConfig.display.titleBar) === '[object Boolean]'
        && !userConfig.display.titleBar
    ) 
    {
        display.titleBar = false;
        return;
    }

    

    var win = config.window || {};
    var disabledTitleBarPages = platConfig[platConfig['buildType']].disabledTitleBarPages || [];
    disabledTitleBarPages.forEach(function(el){
        // userPath/titledemo/source/pages/index/index.js => pages/index/index
        let route = path.relative( path.join(process.cwd(), platConfig.sourceDir),  path.dirname(el) );
        display.pages = display.pages || {};
        display['pages'][route] = display['pages'][route] || {};
        display['pages'][route]['titleBar'] = false;
    });
    
    display.titleBarText = win.navigationBarTitleText || 'nanachi';
    display.titleBarTextColor = win.navigationBarTextStyle || 'black';
    display.backgroundColor = win.navigationBarBackgroundColor || '#000000';

    

}

//配置name, permissions, config, subpackages, 各支付签名
function setOtherConfig() {
    let userConfig = {};
    try {
        userConfig = require(path.join(process.cwd(), 'source', 'quickConfig.json'));
    } catch (err) {
        // eslint-disable-next-line
    }

    if (
        userConfig.display 
        && Object.prototype.toString.call(userConfig.display.menu) === '[object Boolean]'
        && !userConfig.display.menu
    ) 
    {
        manifest.display.menu = false;
    }
   
    //配置各支付签名
    let userFeatures = userConfig.features || [];
    let features = manifest.features.map(function(el){
        let userFeat = userFeatures.find(function(userFeat){
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


module.exports = function quickConfig(config, modules){
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