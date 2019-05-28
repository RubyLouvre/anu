const path = require('path');
const cwd = process.cwd();

const REACT_LIB_MAP = {
    wx: 'ReactWX.js',
    ali: 'ReactAli.js',
    bu: 'ReactBu.js',
    quick: 'ReactQuick.js',
    h5: 'ReactH5.js',
    qq: 'ReactWX.js',
    tt: 'ReactWX.js'
};

const MAP = {
    'wx': {
        EXT_NAME: {
            'css': 'wxss',
            'scss': 'wxss',
            'sass': 'wxss',
            'less': 'wxss',
            'html': 'wxml',
            'jsx': 'js',
        },
        patchComponents: []
    },
    'qq': {
        EXT_NAME: {
            'css': 'qss',
            'scss': 'qss',
            'sass': 'qss',
            'less': 'qss',
            'html': 'qml',
            'jsx': 'js',
        },
        patchComponents: []
    },
    'ali': {
        EXT_NAME: {
            'css': 'acss',
            'scss': 'acss',
            'sass': 'acss',
            'less': 'acss',
            'html': 'axml',
            'jsx': 'js',
        },
        patchComponents: [
            'rich-text' //年前还不支持这标签 https://docs.alipay.com/mini/component/rich-text
        ]
    },
    'bu': {
        EXT_NAME: {
            'css': 'css',
            'scss': 'css',
            'sass': 'css',
            'less': 'css',
            'html': 'swan',
            'jsx': 'js',
        },
        patchComponents: []
    },
    'tt': {
        EXT_NAME: {
            'css': 'ttss',
            'scss': 'ttss',
            'sass': 'ttss',
            'less': 'ttss',
            'html': 'ttml',
            'jsx': 'js',
        },
        patchComponents: []
    },
    'quick': {
        EXT_NAME: {
            'css': 'css',
            'scss': 'css',
            'sass': 'css',
            'less': 'css'
        },
        patchComponents: ['radio', 'radio-group', 'checkbox', 'checkbox-group', 'label', 'navigator', 'picker']
    },
    'h5': {
        EXT_NAME: {
            'css': 'css',
            'scss': 'css',
            'sass': 'css',
            'less': 'css'
        },
        patchComponents: []
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
    },
    'analysis': {
        alias: 'a',
        desc: '打包产物分析'
    },
    'silent': {
        alias: 's',
        desc: '关闭eslint warning'
    }
};

const NANACHI_CONFIG_PATH = path.resolve(cwd, 'nanachi.config.js');

module.exports = {
    REACT_LIB_MAP,
    BUILD_OPTIONS,
    MAP,
    NANACHI_CONFIG_PATH
};
