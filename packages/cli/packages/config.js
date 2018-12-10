
const path = require('path');
const getPatchComponentDir = (componentName)=>{
    return path.join(__dirname, 'patchComponents', componentName);
};

let userConfig = {
    buildDir: 'dist',
    sourceDir: 'source'
};
try {
    const pkg = require( path.join(process.cwd(), 'package.json') );
    userConfig = pkg.nanachi ||  pkg.mpreact || userConfig
} catch (err) {
    // eslint-disable-next-line
}
const buildDir = userConfig.buildDir ;
const sourceDir = userConfig.sourceDir;
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
        patchComponents: {
            'rich-text': {
                name: 'AliRichText',
                href: getPatchComponentDir('AliRichText') //获得patchComponent路径
            }
        }
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
    buildType: 'wx',      //构建类型默认微信小程序
    buildDir: buildDir,   //非快应用项目默认构建目录为dist
    sourceDir: sourceDir  //默认生成的源码目录
};