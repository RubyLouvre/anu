"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path = __importStar(require("path"));
const config_1 = __importDefault(require("../../config/config"));
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
        { name: 'system.contact' },
        { name: 'service.app' },
        { name: 'service.share', 'params': { 'appSign': '', 'wxKey': '' } },
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
                'package': '',
                'appId': '',
                'sign': '',
                'clientId': ''
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
        pages: {}
    },
    display: {
        menu: true,
        titleBar: true,
        titleBarBackgroundColor: "#ffffff"
    },
    subpackages: []
};
function setRouter(config) {
    config.pages.forEach(function (el, index) {
        var routePath = el.slice(0, -6);
        manifest.router.pages[routePath] = {
            component: 'index'
        };
        if (index === 0) {
            manifest.router.entry = routePath;
        }
    });
    var globalConfig = require('../../config/config');
    if (globalConfig.webview && globalConfig.webview.pages.length) {
        let routePath = 'pages/__web__view__';
        manifest.router.pages[routePath] = {
            component: 'index'
        };
    }
    let userConfig = {};
    try {
        userConfig = require(path.join(process.cwd(), 'source', 'quickConfig.json'));
    }
    catch (err) {
    }
    if (userConfig.router
        && Object.prototype.toString.call(userConfig.router) === '[object Object]') {
        let pages = {};
        if (userConfig.router.entry) {
            delete userConfig.router.entry;
        }
        if (config_1.default.huawei && userConfig.router.pages && Object.prototype.toString.call(userConfig.router.pages) === '[object Object]') {
            pages = Object.assign({}, manifest.router && manifest.router.pages, userConfig.router.pages);
        }
        else {
            delete userConfig.router.pages;
        }
        Object.assign(manifest.router, userConfig.router);
        Object.assign(manifest.router.pages, pages);
    }
    if (config_1.default.huawei
        && userConfig.widgets
        && Object.prototype.toString.call(userConfig.widgets) === '[object Array]') {
        manifest.widgets = userConfig.widgets;
    }
}
function setTitleBar(config) {
    var display = manifest.display;
    let userConfig = {};
    try {
        userConfig = require(path.join(process.cwd(), 'source', 'quickConfig.json'));
    }
    catch (err) {
    }
    var globalConfig = require('../../config/config');
    if (globalConfig.webview
        && /true|false/.test(globalConfig.webview.showTitleBar)
        && !globalConfig.webview.showTitleBar) {
        let routePath = 'pages/__web__view__';
        display['pages'] = display['pages'] || {};
        display['pages'][routePath] = {
            titleBar: false
        };
    }
    if (userConfig.display
        && /true|false/.test(userConfig.display.titleBar)
        && !userConfig.display.titleBar) {
        display.titleBar = false;
        return;
    }
    var win = config.window || {};
    var disabledTitleBarPages = globalConfig.quick.disabledTitleBarPages || [];
    disabledTitleBarPages.forEach(function (el) {
        let route = path.relative(path.join(process.cwd(), config_1.default.sourceDir), path.dirname(el));
        display.pages = display.pages || {};
        display['pages'][route] = display['pages'][route] || {};
        display['pages'][route]['titleBar'] = false;
    });
    display.titleBarText = win.navigationBarTitleText || 'nanachi';
    display.titleBarTextColor = win.navigationBarTextStyle || 'black';
    display.titleBarBackground = win.navigationBarBackgroundColor || '#ffffff';
    display.backgroundColor = win.backgroundColor || '#ffffff';
}
function setOtherConfig() {
    let userConfig = {};
    try {
        userConfig = require(path.join(process.cwd(), 'source', 'quickConfig.json'));
    }
    catch (err) {
    }
    if (userConfig.display
        && /true|false/.test(userConfig.display.menu)
        && !userConfig.display.menu) {
        manifest.display.menu = false;
    }
    let userFeatures = userConfig.features || [];
    let features = manifest.features.map(function (el) {
        let userFeat = userFeatures.find(function (userFeat) {
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
    ].forEach(function (el) {
        if (userConfig[el]) {
            manifest[el] = userConfig[el];
        }
    });
}
module.exports = function quickConfig(config, modules) {
    if (modules.componentType !== 'App')
        return;
    setRouter(config);
    setTitleBar(config);
    if (config_1.default.huawei) {
        manifest.minPlatformVersion = 1040;
    }
    setOtherConfig();
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
