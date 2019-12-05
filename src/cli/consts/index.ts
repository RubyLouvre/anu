import * as path from 'path';
const cwd = process.cwd();

export const REACT_LIB_MAP: {
    [propsName: string]: string;
} = {
    wx: 'ReactWX.js',
    ali: 'ReactAli.js',
    bu: 'ReactBu.js',
    quick: 'ReactQuick.js',
    h5: 'ReactH5.js',
    qq: 'ReactWX.js',
    tt: 'ReactWX.js'
};

export const MAP: {
    [propsName: string]: {
        EXT_NAME: {
            [extName: string]: string;
        }
    }
} = {
    'wx': {
        EXT_NAME: {
            'css': 'wxss',
            'scss': 'wxss',
            'sass': 'wxss',
            'less': 'wxss',
            'html': 'wxml',
            'jsx': 'js',
        }
    },
    'qq': {
        EXT_NAME: {
            'css': 'qss',
            'scss': 'qss',
            'sass': 'qss',
            'less': 'qss',
            'html': 'qml',
            'jsx': 'js',
        }
    },
    'ali': {
        EXT_NAME: {
            'css': 'acss',
            'scss': 'acss',
            'sass': 'acss',
            'less': 'acss',
            'html': 'axml',
            'jsx': 'js',
        }
    },
    'bu': {
        EXT_NAME: {
            'css': 'css',
            'scss': 'css',
            'sass': 'css',
            'less': 'css',
            'html': 'swan',
            'jsx': 'js',
        }
    },
    'tt': {
        EXT_NAME: {
            'css': 'ttss',
            'scss': 'ttss',
            'sass': 'ttss',
            'less': 'ttss',
            'html': 'ttml',
            'jsx': 'js',
        }
    },
    'quick': {
        EXT_NAME: {
            'css': 'css',
            'scss': 'css',
            'sass': 'css',
            'less': 'css'
        }
    },
    'h5': {
        EXT_NAME: {
            'css': 'css',
            'scss': 'css',
            'sass': 'css',
            'less': 'css'
        }
    },
    '360': {
        EXT_NAME: {
            'css': 'css',
            'scss': 'css',
            'sass': 'css',
            'less': 'css'
        }
    }
};

export const NANACHI_CONFIG_PATH = path.resolve(cwd, 'nanachi.config.js');
