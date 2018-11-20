const path = require('path');
const getPatchComponentDir = (componentName)=>{
    return path.join(__dirname, 'patchComponents', componentName);
};
module.exports = {
    wx: {
        libName: 'ReactWX',
        styleExt: 'wxss',
        xmlExt: 'wxml',
        helpers: 'wxHelpers'
    },
    ali: {
        libName: 'ReactAli',
        styleExt: 'acss',
        xmlExt: 'axml',
        helpers: 'aliHelpers',
        patchComponents: {}
    },
    bu: {
        libName: 'ReactBu',
        styleExt: 'css',
        xmlExt: 'swan',
        helpers: 'buHelpers',
        patchComponents: {}
    },
    quick: {
        libName: 'ReactWX',
        jsExt: 'ux',
        helpers: 'quickHelpers',
        patchComponents: {
            button: {
                name: 'Button',
                href: getPatchComponentDir('Button') //获得patchComponent路径
            },
            radio: {
                name: 'Radio',
                href: getPatchComponentDir('Radio')
            },
            checkbox: {
                name: 'Checkbox',
                href: getPatchComponentDir('Checkbox')
            },
            label: {
                name: 'Label',
                href: getPatchComponentDir('Label')
            },
            navigator: {
                name: 'Navigator',
                href: getPatchComponentDir('Navigator')
            }
        }
    },
    tt: {
        libName: 'ReactWX',
        jsExt: 'js',
        styleExt: 'ttss',
        xmlExt: 'ttml',
        helpers: 'ttHelpers',
        patchComponents: {}
    },
    buildType: 'wx',    //构建类型默认微信小程序
    buildDir: 'dist',   //非快应用项目默认构建目录为dist
    sourceDir: 'source' //默认生成的源码目录
};