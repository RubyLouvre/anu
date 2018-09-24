module.exports = Object.assign(module.exports, {
    wx: {
        support: true,
        libName: 'ReactWX',
        styleExt: 'wxss',
        jsExt: 'js',
        xmlExt: 'wxml',
        notSopportResText: ''
    },
    ali: {
        support: true,
        libName: 'ReactAli',
        styleExt: 'acss',
        jsExt: 'js',
        xmlExt: 'axml',
        notSopportResText: '支付宝小程序正在努力支持中, 请静候佳音'
    },
    bu: {
        support: false,
        jsExt: 'js',
        notSopportResText: '百度小程序正在努力支持中, 请静候佳音'
    },
    quick: {
        support: false,
        jsExt: 'ux',
        notSopportResText: '快应用正在努力支持中, 请静候佳音'
    },
    buildType: 'wx'
});
