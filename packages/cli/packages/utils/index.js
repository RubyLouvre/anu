"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const execSync = require('child_process').execSync;
const t = require('@babel/types');
const path = __importStar(require("path"));
const cwd = process.cwd();
const chalk = require('chalk');
const spawn = require('cross-spawn');
const nodeResolve = require('resolve');
const template = require('@babel/template').default;
const ora = require('ora');
const EventEmitter = require('events').EventEmitter;
const config = require('../../config/config');
const isWindow = require('./isWindow');
const isNpm = require('./isNpmModule');
const toUpperCamel = require('./toUpperCamel');
const Event = new EventEmitter();
let pkg;
try {
    pkg = require(path.join(cwd, 'package.json'));
}
catch (e) {
}
const userConfig = pkg && (pkg.nanachi || pkg.mpreact) || {};
const mergeWith = require('lodash.mergewith');
const crypto = require('crypto');
const cachedUsingComponents = {};
let utils = {
    on() {
        Event.on.apply(global, arguments);
    },
    emit() {
        Event.emit.apply(global, arguments);
    },
    spinner(text) {
        return ora(text);
    },
    getStyleValue: require('./calculateStyleString'),
    useYarn() {
        if (config['useYarn'] != undefined) {
            return config['useYarn'];
        }
        try {
            execSync('yarn --version', {
                stdio: 'ignore'
            });
            config['useYarn'] = true;
        }
        catch (e) {
            config['useYarn'] = false;
        }
        return config['useYarn'];
    },
    shortcutOfCreateElement() {
        return 'var h = React.createElement;';
    },
    getNodeName(node) {
        var openTag = node.openingElement;
        return openTag && Object(openTag.name).name;
    },
    getEventName(eventName, nodeName, buildType) {
        if (eventName == 'Click' || eventName == 'Tap') {
            if (buildType === 'quick' || buildType === 'h5') {
                return 'Click';
            }
            else {
                return 'Tap';
            }
        }
        if (buildType === 'quick' && nodeName === 'list') {
            if (eventName === 'ScrollToLower') {
                return 'ScrollBottom';
            }
            else if (eventName === 'ScrollToUpper') {
                return 'ScrollTop';
            }
        }
        if (buildType === 'ali' && nodeName === 'button') {
            if (eventName === 'GetUserInfo') {
                return 'GetAuthorize';
            }
        }
        if (eventName === 'Change') {
            if (nodeName === 'input' || nodeName === 'textarea') {
                if (buildType !== 'quick') {
                    return 'Input';
                }
            }
        }
        return eventName;
    },
    createElement(nodeName, attrs, children) {
        return t.JSXElement(t.JSXOpeningElement(t.jsxIdentifier(nodeName), attrs, config.buildType === 'quick' ? false : !children.length), t.jSXClosingElement(t.jsxIdentifier(nodeName)), children);
    },
    createNodeName(map, backup) {
        return (astPath, modules) => {
            const pagesNeedPatchComponents = config[config.buildType].patchPages || {};
            var orig = astPath.node.name.name;
            if (/^[A-Z]/.test(orig)) {
                return orig;
            }
            var pagePath = modules.sourcePath;
            var currentPage = pagesNeedPatchComponents[pagePath];
            if (currentPage && currentPage[orig]) {
                var patchName = toUpperCamel('x-' + orig);
                return patchName;
            }
            return (astPath.node.name.name = map[orig] || backup);
        };
    },
    createAttribute(name, value) {
        return t.JSXAttribute(t.jsxIdentifier(name), typeof value == 'object' ? value : t.stringLiteral(value));
    },
    createUUID(astPath) {
        return astPath.node.start + astPath.node.end;
    },
    createDynamicAttributeValue(prefix, astPath, indexes) {
        var start = astPath.node.loc.start;
        var name = prefix + start.line + '_' + start.column;
        if (Array.isArray(indexes) && indexes.length) {
            var more = indexes.join("+'-'+");
            return t.jSXExpressionContainer(t.identifier(`'${name}_'+${more}`));
        }
        else {
            return name;
        }
    },
    genKey(key) {
        key = key + '';
        let keyPathAry = key.split('.');
        if (keyPathAry.length > 2) {
            key = '{{' + keyPathAry.slice(1).join('.') + '}}';
        }
        else {
            key = keyPathAry.slice(1).join('');
        }
        return keyPathAry.length > 1 ? key : '*this';
    },
    getAnu(state) {
        return state.file.opts.anu;
    },
    isLoopMap(astPath) {
        if (t.isJSXExpressionContainer(astPath.parentPath) ||
            t.isConditionalExpression(astPath.parentPath) ||
            t.isLogicalExpression(astPath.parentPath)) {
            var callee = astPath.node.callee;
            return callee.type == 'MemberExpression' && callee.property.name === 'map';
        }
    },
    createMethod(path, methodName) {
        return t.ObjectProperty(t.identifier(methodName), t.functionExpression(null, path.node.params, path.node.body, path.node.generator, path.node.async));
    },
    exportExpr(name, isDefault) {
        if (isDefault == true) {
            return template(`module.exports.default = ${name};`)();
        }
        else {
            return template(`module.exports["${name}"] = ${name};`)();
        }
    },
    isNpm: isNpm,
    createRegisterStatement(className, path, isPage) {
        var templateString = isPage ?
            'Page(React.registerPage(CLASSNAME,ASTPATH))' :
            'Component(React.registerComponent(CLASSNAME,ASTPATH))';
        return template(templateString)({
            CLASSNAME: t.identifier(className),
            ASTPATH: t.stringLiteral(path)
        });
    },
    installer(npmName, dev, needModuleEntryPath) {
        needModuleEntryPath = needModuleEntryPath || false;
        return new Promise(resolve => {
            let bin = '';
            let options = [];
            if (this.useYarn()) {
                bin = 'yarn';
                options.push('add', npmName, dev === 'dev' ? '--dev' : '--save');
            }
            else {
                bin = 'npm';
                options.push('install', npmName, dev === 'dev' ? '--save-dev' : '--save');
            }
            let result = spawn.sync(bin, options, {
                stdio: 'inherit'
            });
            if (result.error) {
                console.log(result.error);
                process.exit(1);
            }
            let npmPath = '';
            npmName = npmName.split('@')[0];
            if (needModuleEntryPath) {
                npmPath = nodeResolve.sync(npmName, {
                    basedir: cwd,
                    moduleDirectory: path.join(cwd, 'node_modules'),
                    packageFilter: (pkg) => {
                        if (pkg.module) {
                            pkg.main = pkg.module;
                        }
                        return pkg;
                    }
                });
            }
            resolve(npmPath);
        });
    },
    getDistName(buildType) {
        return buildType === 'quick' ? 'src' : (userConfig && userConfig.buildDir || 'dist');
    },
    getDeps(messages = []) {
        return messages.filter((item) => {
            return item.plugin === 'postcss-import' && item.type === 'dependency';
        });
    },
    getComponentOrAppOrPageReg() {
        return new RegExp(this.sepForRegex + '(?:pages|app|components)');
    },
    hasNpm(npmName) {
        let flag = false;
        try {
            nodeResolve.sync(npmName, {
                moduleDirectory: path.join(cwd, 'node_modules'),
            });
            flag = true;
        }
        catch (err) {
        }
        return flag;
    },
    decodeChinise: require('./decodeChinese'),
    isWebView(fileId) {
        if (config.buildType != 'quick') {
            return false;
        }
        let rules = config.WebViewRules && config.WebViewRules.pages || [];
        if (!rules.length) {
            return false;
        }
        let isWebView = rules.includes(fileId) ||
            rules.some((rule) => {
                return Object.prototype.toString.call(rule) === '[object RegExp]' && rule.test(fileId);
            });
        return isWebView;
    },
    parseCamel: toUpperCamel,
    uniquefilter(arr, key = '') {
        const map = {};
        return arr.filter((item) => {
            if (!item[key]) {
                return true;
            }
            if (!map[item[key]]) {
                map[item[key]] = 1;
                return true;
            }
            return false;
        });
    },
    isWin: function () {
        return isWindow;
    },
    sepForRegex: isWindow ? `\\${path.win32.sep}` : path.sep,
    fixWinPath(p) {
        return p.replace(/\\/g, '/');
    },
    isMportalEnv() {
        const envs = ['prod', 'rc', 'beta'];
        return envs.includes((process.env.NODE_ENV && process.env.NODE_ENV.toLowerCase()));
    },
    cleanLog(log) {
        const reg = /[\s\S]*Module (Error|Warning)\s*\(.*?(es|style)lint.*?\):\n+/gm;
        if (reg.test(log)) {
            return log.replace(/^\s*@[\s\S]*$/gm, '').replace(reg, '');
        }
        return log;
    },
    validatePlatform(platform, platforms) {
        return platforms.some((p) => {
            return p.buildType === platform;
        });
    },
    customizer(objValue, srcValue) {
        if (Array.isArray(objValue)) {
            return objValue.concat(srcValue);
        }
    },
    deepMerge(...args) {
        return mergeWith(...args, utils.customizer);
    },
    getStyleNamespace(dirname) {
        const s = crypto.createHash('md5');
        s.update(dirname);
        return `anu-style-${s.digest('hex').substr(0, 6)}`;
    }
};
module.exports = utils;
exports.default = utils;
