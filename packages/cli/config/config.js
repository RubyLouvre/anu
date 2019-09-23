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
let userConfig = {};
try {
    const pkg = require(path.join(process.cwd(), 'package.json'));
    userConfig = pkg.nanachi || pkg.mpreact || userConfig;
}
catch (err) {
}
const buildDir = userConfig.buildDir || 'dist';
const sourceDir = userConfig.sourceDir || 'source';
var Platforms;
(function (Platforms) {
    Platforms["wx"] = "wx";
    Platforms["qq"] = "qq";
    Platforms["ali"] = "ali";
    Platforms["bu"] = "bu";
    Platforms["tt"] = "tt";
    Platforms["quick"] = "quick";
    Platforms["h5"] = "h5";
    Platforms["QIHOO"] = "360";
})(Platforms || (Platforms = {}));
const config = {
    wx: {
        libName: 'ReactWX',
        styleExt: 'wxss',
        xmlExt: 'wxml',
        helpers: 'wxHelpers',
        patchComponents: {},
        disabledTitleBarPages: new Set()
    },
    qq: {
        libName: 'ReactWX',
        styleExt: 'qss',
        xmlExt: 'qml',
        helpers: 'qqHelpers',
        patchComponents: {},
        disabledTitleBarPages: new Set()
    },
    ali: {
        libName: 'ReactAli',
        styleExt: 'acss',
        xmlExt: 'axml',
        helpers: 'aliHelpers',
        patchComponents: {},
        disabledTitleBarPages: new Set()
    },
    bu: {
        libName: 'ReactBu',
        styleExt: 'css',
        xmlExt: 'swan',
        helpers: 'buHelpers',
        patchComponents: {},
        disabledTitleBarPages: new Set()
    },
    h5: {
        libName: 'ReactH5',
        helpers: 'h5Helpers',
        patchComponents: {},
        disabledTitleBarPages: new Set()
    },
    '360': {
        libName: 'ReactH5',
        helpers: 'h5Helpers',
        patchComponents: {},
        disabledTitleBarPages: new Set()
    },
    quick: {
        libName: 'ReactQuick',
        jsExt: 'ux',
        helpers: 'quickHelpers',
        patchComponents: {
            'radio': 1,
            'radio-group': 1,
            'checkbox': 1,
            'checkbox-group': 1,
            'label': 1,
            'navigator': 1,
            'picker': 1
        },
        disabledTitleBarPages: new Set()
    },
    tt: {
        libName: 'ReactWX',
        jsExt: 'js',
        styleExt: 'ttss',
        xmlExt: 'ttml',
        helpers: 'ttHelpers',
        patchComponents: {},
        disabledTitleBarPages: new Set()
    },
    buildType: 'wx',
    buildDir: buildDir,
    sourceDir: sourceDir,
    huawei: false,
    '360mode': false,
    typescript: false,
    patchComponents: {},
    pluginTags: {},
    plugins: {}
};
module.exports = config;
exports.default = config;
