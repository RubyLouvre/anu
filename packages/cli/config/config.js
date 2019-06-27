const path = require('path');
let userConfig = {};
try {
    const pkg = require(path.join(process.cwd(), 'package.json'));
    userConfig = pkg.nanachi || pkg.mpreact || userConfig;
} catch (err) {
    // eslint-disable-next-line
}
const buildDir = userConfig.buildDir || 'dist';
const sourceDir = userConfig.sourceDir || 'source';
module.exports = {
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
    quick: {
        libName: 'ReactWX',
        jsExt: 'ux',
        helpers: 'quickHelpers',
       
        patchComponents: {
            radio: 1,
            'radio-group': 1,
            checkbox: 1,
            'checkbox-group':1,
            label: 1,
            navigator: 1,
            picker: 1
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
