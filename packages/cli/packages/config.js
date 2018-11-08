const path = require('path');
const getPatchComponentDir = (componentName)=>{
    return path.join(__dirname, 'patchComponents', componentName);
};
module.exports = {
    wx: {
        libName: 'ReactWX',
        styleExt: 'wxss',
        xmlExt: 'wxml',
        helpers: 'wxHelpers',
        patchComponents: {
            
        }
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
            Button: {
                name: 'Button',
                href: getPatchComponentDir('Button')
            },
            Radio: {
                name: 'Radio',
                href: getPatchComponentDir('Radio')
            },
            Checkbox: {
                name: 'Checkbox',
                href: getPatchComponentDir('Checkbox')
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