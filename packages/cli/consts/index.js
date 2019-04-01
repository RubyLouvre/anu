const REACT_LIB_MAP = {
    wx: 'ReactWX.js',
    ali: 'ReactAli.js',
    bu: 'ReactBu.js',
    quick: 'ReactQuick.js',
    h5: 'ReactH5.js',
    tt: 'ReactWX.js'
};

const EXT_MAP = {
    'wx': {
        'css': 'wxss',
        'scss': 'wxss',
        'sass': 'wxss',
        'less': 'wxss',
        'html': 'wxml',
        'jsx': 'js',
    },
    'ali': {
        'css': 'acss',
        'scss': 'acss',
        'sass': 'acss',
        'less': 'acss',
        'html': 'axml',
        'jsx': 'js',
    },
    'bu': {
        'css': 'css',
        'scss': 'css',
        'sass': 'css',
        'less': 'css',
        'html': 'swan',
        'jsx': 'js',
    },
    'tt': {
        'css': 'ttss',
        'scss': 'ttss',
        'sass': 'ttss',
        'less': 'ttss',
        'html': 'ttml',
        'jsx': 'js',
    },
    'quick': {
        'jsx': 'ux',
    }
};

const BUILD_OPTIONS = {
    'compress': {
        alias: 'c',
        desc: '压缩资源'
    },
    'beta': {
        desc: '同步react runtime'
    },
    'beta-ui': {
        desc: '同步schnee-ui'
    },
    'huawei': {
        desc: '补丁华为快应用'
    }
};

module.exports = {
    REACT_LIB_MAP,
    BUILD_OPTIONS,
    EXT_MAP
};
