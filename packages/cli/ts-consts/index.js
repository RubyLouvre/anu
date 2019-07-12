"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const path = __importStar(require("path"));
const cwd = process.cwd();
exports.REACT_LIB_MAP = {
    wx: 'ReactWX.js',
    ali: 'ReactAli.js',
    bu: 'ReactBu.js',
    quick: 'ReactQuick.js',
    h5: 'ReactH5.js',
    qq: 'ReactWX.js',
    tt: 'ReactWX.js'
};
exports.MAP = {
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
            'rich-text'
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
exports.NANACHI_CONFIG_PATH = path.resolve(cwd, 'nanachi.config.js');
