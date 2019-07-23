import * as path from 'path';
let userConfig: any = {};
try {
    const pkg = require(path.join(process.cwd(), 'package.json'));
    userConfig = pkg.nanachi || pkg.mpreact || userConfig;
} catch (err) {
    // eslint-disable-next-line
}
const buildDir = userConfig.buildDir || 'dist';
const sourceDir = userConfig.sourceDir || 'source';

interface patchComponents {
    [patchName: string]: number | string;
}

interface PlatConfig {
    libName: string;
    styleExt?: string;
    xmlExt?: string;
    jsExt?: string;
    helpers: string;
    patchComponents: patchComponents,
    disabledTitleBarPages: Set<string>;
    patchPages?: any;
}

enum Platforms {
    wx = 'wx',
    qq = 'qq',
    ali = 'ali',
    bu = 'bu',
    tt = 'tt',
    quick = 'quick',
    h5 = 'h5'
}

export type validatePlatforms = 'wx' | 'qq' | 'ali' | 'bu' | 'tt' | 'quick' | 'h5';

export interface GlobalConfigMap {
    buildType: validatePlatforms;      //构建类型默认微信小程序
    buildDir: string;   //非快应用项目默认构建目录为dist
    sourceDir: string;  //默认生成的源码目录
    huawei: boolean;
    patchComponents: patchComponents; // 项目中使用的补丁组件
    pluginTags: any;
    plugins: any;
    compress?: boolean;
    WebViewRules?: any; // TODO
    [Platforms.wx]: PlatConfig;
    [Platforms.qq]: PlatConfig;
    [Platforms.ali]: PlatConfig;
    [Platforms.bu]: PlatConfig;
    [Platforms.quick]: PlatConfig;
    [Platforms.tt]: PlatConfig;
    [Platforms.h5]: PlatConfig;
}
const config: GlobalConfigMap =  {
    wx: {
        libName: 'ReactWX',
        styleExt: 'wxss',
        xmlExt: 'wxml',
        helpers: 'wxHelpers',
        patchComponents: {},
        disabledTitleBarPages: new Set()
    },
    qq: {
        libName: 'ReactWX',
        styleExt: 'qss',
        xmlExt: 'qml',
        helpers: 'qqHelpers',
        patchComponents: {},
        disabledTitleBarPages: new Set()
    },
    ali: {
        libName: 'ReactAli',
        styleExt: 'acss',
        xmlExt: 'axml',
        helpers: 'aliHelpers',
        patchComponents: {},
        disabledTitleBarPages: new Set()
    },
    bu: {
        libName: 'ReactBu',
        styleExt: 'css',
        xmlExt: 'swan',
        helpers: 'buHelpers',
        patchComponents: {},
        disabledTitleBarPages: new Set()
    },
    h5: {
        libName: 'ReactH5',
        helpers: 'h5Helpers',
        patchComponents: {},
        disabledTitleBarPages: new Set()
    },
    quick: {
        libName: 'ReactQuick',
        jsExt: 'ux',
        helpers: 'quickHelpers',
        patchComponents: {
            'radio': 1,
            'radio-group': 1,
            'checkbox': 1,
            'checkbox-group':1,
            'label': 1,
            'navigator': 1,
            'picker': 1
        },
        disabledTitleBarPages:new Set()
    },
    tt: {
        libName: 'ReactWX',
        jsExt: 'js',
        styleExt: 'ttss',
        xmlExt: 'ttml',
        helpers: 'ttHelpers',
        patchComponents: {},
        disabledTitleBarPages: new Set()
    },
    buildType: 'wx',      //构建类型默认微信小程序
    buildDir: buildDir,   //非快应用项目默认构建目录为dist
    sourceDir: sourceDir,  //默认生成的源码目录
    huawei: false,
    patchComponents: {}, // 项目中使用的补丁组件
    pluginTags: {},
    plugins: {}
};

module.exports = config;
export default config;
