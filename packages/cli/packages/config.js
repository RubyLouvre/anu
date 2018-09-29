module.exports = Object.assign(module.exports, {
    wx: {
        support: true,
        libName: 'ReactWX',
        styleExt: 'wxss',
        jsExt: 'js',
        xmlExt: 'wxml',
        notSopportResText: '',
        helpers: 'wxHelpers'
    },
    ali: {
        support: true,
        libName: 'ReactAli',
        styleExt: 'acss',
        jsExt: 'js',
        xmlExt: 'axml',
        notSopportResText: '支付宝小程序正在努力支持中, 请静候佳音',
        helpers: 'aliHelpers'
    },
    bu: {
        support: true,
        jsExt: 'js',
        notSopportResText: '百度小程序正在努力支持中, 请静候佳音',
        helpers: 'buHelpers'
    },
    quick: {
        support: false,
        jsExt: 'ux',
        notSopportResText: '快应用正在努力支持中, 请静候佳音',
        buHelpers: 'quickHelpers'
    },
    buildType: 'wx'   //构建类型默认微信小程序
});