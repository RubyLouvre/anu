const path = require('path');
let userConfig = {};
try {
    const pkg = require( path.join(process.cwd(), 'package.json') );
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
        patchComponents: []
    },
    ali: {
        libName: 'ReactAli',
        styleExt: 'acss',
        xmlExt: 'axml',
        helpers: 'aliHelpers',
        patchComponents: [
            'rich-text'
        ]
    },
    bu: {
        libName: 'ReactBu',
        styleExt: 'css',
        xmlExt: 'swan',
        helpers: 'buHelpers',
        patchComponents: []
    },
    quick: {
        libName: 'ReactWX',
        jsExt: 'ux',
        helpers: 'quickHelpers',
        patchComponents: [
            'icon',
            'button',
            'radio',
            'checkbox',
            'label',
            'navigator'
        ]
    },
    tt: {
        libName: 'ReactWX',
        jsExt: 'js',
        styleExt: 'ttss',
        xmlExt: 'ttml',
        helpers: 'ttHelpers',
        patchComponents: []
    },
    buildType: 'wx',      //构建类型默认微信小程序
    buildDir: buildDir,   //非快应用项目默认构建目录为dist
    sourceDir: sourceDir  //默认生成的源码目录
};