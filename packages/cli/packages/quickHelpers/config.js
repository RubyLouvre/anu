/*!
快应用不支持 类属性， 只好将它抽出来放到类名后面
并且针对app要做一些转换

*/
const path = require('path');
const utils = require('../utils');
const platConfig = require('../config');


module.exports = function quickConfig(config, modules, queue){
    if (modules.componentType === 'App'){
        var manifest = {
            package: 'org.hapjs.demo.sample',
            name: 'nanachi转快应用',
            versionName: '1.1',
            versionCode: 1,
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
                        'appId': 'xxx',
                        'package': 'xxx',
                        'sign': 'xxx'
                    }
                },
                {
                    name: 'service.qqaccount',
                    'params': {
                        'package':'xxx',
                        'appId': 'xxx',
                        'sign': 'xxx',
                        'clientId':'xxx'
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
            }
              
        };
        config.pages.forEach(function(el ,index){

            //如果是webview, 不注入router配置
            if (utils.isWebView(path.join(process.cwd(), platConfig.sourceDir, el + '.js' ))) {
                return;
            }
            var routePath = el.slice(0, -6);
            manifest.router.pages[routePath] = {
                component: 'index'
            };
            //设置首页
            if (index === 0){
                manifest.router.entry = routePath;
            } 
        });
        var display = manifest.display ;
        var win = config.window || {};

        //配置page页面titlebar
        var disabledTitleBarPages = platConfig[platConfig['buildType']].disabledTitleBarPages;
        disabledTitleBarPages.forEach(function(el){
            // userPath/titledemo/source/pages/index/index.js => pages/index/index
            let route = path.relative( path.join(process.cwd(), platConfig.sourceDir),  path.dirname(el) );
            display['pages'] = display['pages'] || {};
            display['pages'][route] = display['pages'][route] || {};
            display['pages'][route]['titleBar'] = false;
        });
        
        display.titleBarText = win.navigationBarTitleText || 'nanachi';
        display.titleBarTextColor = win.navigationBarTextStyle || 'black';
        display.backgroundColor = win.navigationBarBackgroundColor || '#000000';
        queue.push({
            path: path.join(process.cwd(), 'src', 'manifest.json'),
            code: JSON.stringify(manifest, null, 4),
            type: 'json'
        });
        delete config.window;
        delete config.pages;
        Object.assign(config, win);
        return;
    }
};