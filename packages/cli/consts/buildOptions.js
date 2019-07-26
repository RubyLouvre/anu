"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
exports.default = BUILD_OPTIONS;
