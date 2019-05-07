/* eslint no-console: 0 */
/* eslint-disable*/
const execSync = require('child_process').execSync;
const t = require('@babel/types');
const path = require('path');
const cwd = process.cwd();
const chalk = require('chalk');
const spawn = require('cross-spawn');
const nodeResolve = require('resolve');
const template = require('@babel/template').default;
const ora = require('ora');
const EventEmitter = require('events').EventEmitter;
const config = require('../../config/config');
const Event = new EventEmitter();
const pkg = require(path.join(cwd, 'package.json'));
const userConfig = pkg.nanachi || pkg.mpreact || {};
const { REACT_LIB_MAP } = require('../../consts/index');
const imageminOptipng = require('imagemin-optipng');
const imageminSvgo = require('imagemin-svgo');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminGifsicle = require('imagemin-gifsicle');

//const fs = require('fs-extra');
// 这里只处理多个平台会用的方法， 只处理某一个平台放到各自的helpers中
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
    getStyleValue: require('./getStyleValue'),
    isWin() {
        return process.platform === 'win32';
    },
    useYarn() {
        if (config['useYarn'] != undefined) {
            return config['useYarn'];
        }
        try {
            execSync('yarn --version', {
                stdio: 'ignore'
            });
            config['useYarn'] = true;
        } catch (e) {
            config['useYarn'] = false;
        }
        return config['useYarn'];
    },
    shortcutOfCreateElement() {
        return 'var h = React.createElement;';
    },
    //传入path.node, 得到标签名
    getNodeName(node) {
        var openTag = node.openingElement
        return openTag && Object(openTag.name).name
    },
    getEventName(eventName, nodeName, buildType) {
        if (eventName == 'Click' || eventName == 'Tap') {
            if (buildType === 'quick' || buildType === 'h5') {
                return 'Click';
            } else {
                return 'Tap';
            }
        }
        if (buildType === 'quick' && nodeName === 'list') {
            if (eventName === 'ScrollToLower') {
                return 'ScrollBottom' //快应用的list标签的事件
            } else if (eventName === 'ScrollToUpper') {
                return 'ScrollTop'
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
        return t.JSXElement(
            t.JSXOpeningElement(
                // [babel 6 to 7] The case has been changed: jsx and ts are now in lowercase.
                t.jsxIdentifier(nodeName),
                attrs,
                config.buildType === 'quick' ? false : !children.length
            ),
            // [babel 6 to 7] The case has been changed: jsx and ts are now in lowercase.
            t.jSXClosingElement(t.jsxIdentifier(nodeName)),
            children
        );
    },
    createNodeName(map, backup) {
        //这用于wxHelpers/nodeName.js, quickHelpers/nodeName.js
        return (astPath, modules) => {
            // 在回调函数中取patchNode，在外层取会比babel插件逻辑先执行，导致一直为{}
            const patchNode = config[config.buildType].jsxPatchNode || {}; 
            const UIName = 'schnee-ui';
            var orig = astPath.node.name.name;
            var fileId = modules.sourcePath;
            var isPatchNode = patchNode[fileId] && patchNode[fileId].includes(orig);
            var prefix = 'X';
            var patchName = '';
            //组件名肯定大写开头
            if (/^[A-Z]/.test(orig)) {
                return orig;
            }
            //schnee-ui补丁
            if (isPatchNode) {
                if (/\-/.test(orig)) {
                    //'rich-text' ==> RichText;
                    patchName = orig.split('-').map((el) => {
                        return el.replace(/^[a-z]/, (match) => {
                            return match.toUpperCase()
                        })
                    }).join('');
                    patchName = prefix + patchName;
                } else {
                    //button ==> XButton
                    patchName = prefix + orig.charAt(0).toUpperCase() + orig.substring(1);
                }
                modules.importComponents[patchName] = {
                    source: UIName
                };
                return patchName;
            }
            return (astPath.node.name.name = map[orig] || backup);
        }
    },
    getUsedComponentsPath(bag, nodeName, modules) {
        let isNpm = this.isNpm(bag.source);
        let sourcePath = modules.sourcePath;
        let isNodeModulePathReg = this.isWin() ? /\\npm\\/ : /\/npm\//;

        //import { xxx } from 'schnee-ui';
        if (isNpm) {
            return '/npm/' + bag.source + '/components/' + nodeName + '/index';
        }
        //如果XPicker中存在 import XOverlay from '../XOverlay/index';
        if ( isNodeModulePathReg.test(sourcePath) && /^\./.test(bag.source) ) {
            //获取用组件的绝对路径
            let importerAbPath = path.resolve(path.dirname(sourcePath), bag.source);
            return '/npm/' + importerAbPath.split(`${path.sep}npm${path.sep}`)[1]
        }
        return `/components/${nodeName}/index`;
    },
    createAttribute(name, value) {
        return t.JSXAttribute(
            // [babel 6 to 7] The case has been changed: jsx and ts are now in lowercase.
            t.jsxIdentifier(name),
            typeof value == 'object' ? value : t.stringLiteral(value)
        );
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
        } else {
            return name;
        }
    },
    genKey(key) {
        key = key + '';
        return key.indexOf('.') > 0 ? key.split('.').pop() : '*this';
    },
    getAnu(state) {
        return state.file.opts.anu;
    },
    isLoopMap(astPath) {
        if (
            t.isJSXExpressionContainer(astPath.parentPath) ||
            t.isConditionalExpression(astPath.parentPath) ||
            t.isLogicalExpression(astPath.parentPath)
        ) {
            var callee = astPath.node.callee;
            return callee.type == 'MemberExpression' && callee.property.name === 'map';
        }
    },
    createMethod(path, methodName) {
        //将类方法变成对象属性
        //https://babeljs.io/docs/en/babel-types#functionexpression
        return t.ObjectProperty(
            t.identifier(methodName),
            t.functionExpression(
                null,
                path.node.params,
                path.node.body,
                path.node.generator,
                path.node.async
            )
        );
    },
    exportExpr(name, isDefault) {
        if (isDefault == true) {
            return template(`module.exports.default = ${name};`)();
        } else {
            return template(`module.exports["${name}"] = ${name};`)();
        }
    },
    isNpm(name) {
        if (/^\/|\./.test(name)) {
            return false;
        }
        //非自定义alias, @components ...
        let aliasKeys = Object.keys(this.getAliasConfig());
        if (aliasKeys.includes(name.split('/')[0])) {
            return false;
        }
        return true;
    },
    createRegisterStatement(className, path, isPage) {
        /**
         * placeholderPattern
         * Type: RegExp | false Default: /^[_$A-Z0-9]+$/
         * 
         * A pattern to search for when looking for Identifier and StringLiteral nodes
         * that should be considered placeholders. 'false' will disable placeholder searching
         * entirely, leaving only the 'placeholderWhitelist' value to find placeholders.
         */
        var templateString = isPage ?
            'Page(React.registerPage(CLASSNAME,ASTPATH))' :
            'Component(React.registerComponent(CLASSNAME,ASTPATH))';
        return template(templateString)({
            CLASSNAME: t.identifier(className),
            ASTPATH: t.stringLiteral(path)
        });
    },
    /**
     *
     * @param {String} 要修改的路径（存在平台差异性）
     * @param {String} segement
     * @param {String} newSegement
     * @param {String?} ext 新的后缀名
     */
    updatePath(spath, segement, newSegement, newExt, ext) {
        var lastSegement = '',
            replaced = false;
        var arr = spath.split(path.sep).map(function (el) {
            lastSegement = el;
            if (segement === el && !replaced) {
                replaced = true;
                return newSegement;
            }
            return el;
        });
        if (newExt) {
            ext = ext || 'js';
            arr[arr.length - 1] = lastSegement.replace('.' + ext, '.' + newExt);
        }
        let resolvedPath = path.join.apply(path, arr);
        if (!this.isWin()) {
            // Users/x/y => /Users/x/y;
            resolvedPath = '/' + resolvedPath;
        }
        return resolvedPath;
    },
    installer(npmName, dev, needModuleEntryPath) {
        needModuleEntryPath = needModuleEntryPath || false;
        return new Promise(resolve => {
            let bin = '';
            let options = [];
            if (this.useYarn()) {
                bin = 'yarn';
                options.push('add', npmName, dev === 'dev' ? '--dev' : '--save');
            } else {
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
                //获得自动安装的npm依赖模块路径
                npmPath = nodeResolve.sync(npmName, {
                    basedir: cwd,
                    moduleDirectory: path.join(cwd, 'node_modules'),
                    packageFilter: pkg => {
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
    getReactLibName(buildType) {
        return REACT_LIB_MAP[buildType];
    },
    getAliasConfig() {
        let React = this.getReactLibName(config.buildType);
        let userAlias = userConfig.alias ? userConfig.alias : {};
        let ret = {}

        //用户自定义的alias配置设置成绝对路径
        Object.keys(userAlias).forEach((key) => {
            ret[key] = path.join(cwd, userAlias[key])
        });

        let defaultAlias = {
            'react': path.join(cwd, `${config.sourceDir}/${React}`),
            '@react': path.join(cwd, `${config.sourceDir}/${React}`),
            '@components': path.join(cwd, `${config.sourceDir}/components`),
            ...ret
        }
        return defaultAlias;
    },
    resolveDistPath(filePath) {
        let dist = config.buildType === 'quick' ? 'src' : (config.buildDir || 'dist');
        let sep = path.sep;
        let reg = this.isWin() ? /\\node_modules\\/g : /\/node_modules\//g;
        filePath = utils.updatePath(filePath, 'dist', dist); //待优化
        return reg.test(filePath) ?
            utils.updatePath(filePath, 'node_modules', `${dist}${sep}npm`) :
            utils.updatePath(filePath, config.sourceDir, dist);
    },
    resolveAliasPath(id, deps) {
        let ret = {};
        Object.keys(deps).forEach((depKey) => {
            ret[depKey] = path.relative(
                path.dirname(this.resolveDistPath(id)),
                this.resolveDistPath(deps[depKey])
            )
        });
        return ret;
    },
    getRegeneratorRuntimePath: function (sourcePath) {
        //小程序async/await语法依赖regenerator-runtime/runtime
        try {
            return nodeResolve.sync('regenerator-runtime/runtime', {
                basedir: path.resolve(process.cwd(), 'source')
            });
            // const distPath = path.resolve(cwd, config.buildType === 'quick' ? './src' : './dist');
            // console.log(path.resolve(distPath, './regenerator-runtime/runtime.js'));
            // if (fs.ensureFileSync(path.resolve(distPath, 'regenerator-runtime/runtime.js'))) {
            //     return path.resolve(distPath, 'regenerator-runtime/runtime');
            // } else {
            //     // eslint-disable-next-line
            //     console.log(
            //         'Error: ' +
            //         sourcePath +
            //         '\n' +
            //         'Msg: ' +
            //         chalk.red('async/await语法缺少依赖 regenerator-runtime ,请安装')
            //     );
            // }
        } catch (err) {
            // eslint-disable-next-line
            console.log(
                'Error: ' +
                sourcePath +
                '\n' +
                'Msg: ' +
                chalk.red('async/await语法缺少依赖 regenerator-runtime ,请安装')
            );
        }
    },
    resolveStyleAlias(importer, basedir) {
        //解析样式中的alias别名配置
        let aliasMap = (userConfig && userConfig.alias) || {};
        let depLevel = importer.split('/'); //'@path/x/y.scss' => ['@path', 'x', 'y.scss']
        let prefix = depLevel[0];

        //将alias以及相对路径引用解析成绝对路径
        if (aliasMap[prefix]) {
            importer = path.join(
                cwd,
                aliasMap[prefix],
                depLevel.slice(1).join('/') //['@path', 'x', 'y.scss'] => 'x/y.scss'
            );
            let val = path.relative(basedir, importer);
            val = /^\w/.test(val) ? `./${val}` : val; //相对路径加./
            return val;
        }
        return importer;
    },
    getDeps(messages = []) {
        return messages.filter((item) => {
            return item.plugin === 'postcss-import' && item.type === 'dependency';
        });
    },
    getComponentOrAppOrPageReg() {
        return new RegExp(this.sepForRegex + '(?:pages|app|components|patchComponents)');
    },
    hasNpm(npmName) {
        let flag = false;
        try {
            nodeResolve.sync(
                npmName, {
                    moduleDirectory: path.join(cwd, 'node_modules'),
                }
            );
            flag = true;
        } catch (err) {
            // eslint-disable-next-line
        }
        return flag;
    },
    isWebView(fileId) {
        
        if (config.buildType != 'quick') {
            return false;
        }

        let rules = config.WebViewRules && config.WebViewRules.pages || [];
        
        if ( !rules.length ) {
            return false;
        }
       
       
        let isWebView =
        rules.includes(fileId) ||
        rules.some((rule) => {
                //如果是webview设置成true, 则用增则匹配
                return Object.prototype.toString.call(rule) === '[object RegExp]' && rule.test(fileId);
            });
       
        return isWebView;

    },
    parseCamel(str) {
        return str
            .replace(/-([a-z])/g, function(match, first) {
                return first.toUpperCase();
            })
            .replace(/^[a-z]/, function(match) {
                return match.toUpperCase();
            });
    },
    uniquefilter(arr, key = '') {
        const map = {};
        return arr.filter(item => {
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
    sepForRegex: process.platform === 'win32' ? `\\${path.win32.sep}` : path.sep,
    fixWinPath(p) {
        return p.replace(/\\/g, '/');
    },
    isMportalEnv() {
        return ['prod', 'rc', 'beta'].includes((process.env.NODE_ENV && process.env.NODE_ENV.toLowerCase()))
    },
    compressImage(content, type, { png, jpg, gif, svg }) {
        switch(type) {
            case 'png':
                return this.compressPNG(content, png);
            case 'jpg':
            case 'jpeg':
                return this.compressJPG(content, jpg);
            case 'gif':
                return this.compressGIF(content, gif);
            case 'svg':
                return this.compressSVG(content, svg);
            default:
                return content;
        }
    },
    compressPNG(content, option = {}) {
        return imageminOptipng(option)(content);
    },
    compressSVG(content, option = {}) {
        return imageminSvgo(option)(content);
    },
    compressJPG(content, option = {}) {
        return imageminMozjpeg(option)(content);
    },
    compressGIF(content, option = {}) {
        return imageminGifsicle(option)(content);
    }
};

exports = module.exports = utils;
