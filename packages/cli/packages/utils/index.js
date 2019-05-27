/* eslint no-console: 0 */
/* eslint-disable*/
const execSync = require('child_process').execSync;
const t = require('@babel/types');
const path = require('path');
const cwd = process.cwd();
const chalk = require('chalk');
const spawn = require('cross-spawn');
const uglifyJS = require('uglify-es');
const cleanCSS = require('clean-css');
const nodeResolve = require('resolve');
const template = require('@babel/template').default;
const ora = require('ora');
const EventEmitter = require('events').EventEmitter;
const config = require('../config');
const isWindow = require('./isWindow');
const isNpm = require('./isNpmModule');
const toUpperCamel = require('./toUpperCamel');
const Event = new EventEmitter();
const pkg = require(path.join(cwd, 'package.json'));
const userConfig = pkg.nanachi || pkg.mpreact || {};
// const { REACT_LIB_MAP } = require('../../consts/index');
const calculateComponentsPath = require('./calculateComponentsPath');
const calculateAliasConfig = require('./calculateAliasConfig');
const cachedUsingComponents = {}
// 这里只处理多个平台会用的方法， 只处理某一个平台放到各自的helpers中
let utils = {
    on() {
        Event.on.apply(global, arguments);
    },
    emit() {
        Event.emit.apply(global, arguments);
    },
    spinner(text) { //在控制台显示进度条
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
            //如果是点击事件，PC端与快应用 使用quick
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
        const pagesNeedPatchComponents = config[config.buildType].patchPages || {};
        const UIName = 'schnee-ui';
        //这用于wxHelpers/nodeName.js, quickHelpers/nodeName.js
        return (astPath, modules) => {
            var orig = astPath.node.name.name;
            //组件名肯定大写开头
            if (/^[A-Z]/.test(orig)) {
                return orig;
            }
            var pagePath = modules.sourcePath;
            var currentPage = pagesNeedPatchComponents[pagePath];
            //schnee-ui补丁
            if (currentPage && currentPage[orig]) {
                //'rich-text' ==> RichText;
                // button ==> XButton
                var patchName = toUpperCamel( 'x-' + orig )
                modules.importComponents[patchName] = {
                    source: UIName
                };
                return patchName;
            }
            return (astPath.node.name.name = map[orig] || backup);
        }
    },
    getUsedComponentsPath(bag, nodeName, modules) {
        if(cachedUsingComponents[nodeName]){
            return cachedUsingComponents[nodeName]
        }
      
        return cachedUsingComponents[nodeName] = calculateComponentsPath(bag, nodeName, modules)
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

    isNpm: isNpm,
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
        if (!isWindow) {
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
  // 没有人用
  //  getReactLibName(buildType) {
  //      return REACT_LIB_MAP[buildType];
  //  },
    getAliasConfig() {
        return calculateAliasConfig(config, userConfig, cwd );
    },
    resolveDistPath(filePath) {
        let dist = config.buildType === 'quick' ? 'src' : (config.buildDir || 'dist');
        let sep = path.sep;
        let reg = isWindow ? /\\node_modules\\/g : /\/node_modules\//g;
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
                basedir: process.cwd()
            });
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
    compress: function () {
        return {
            js: function (code) {
                let result = uglifyJS.minify(code);
                if (result.error) {
                   return code;
                }
                return result.code;
            },
            npm: function (code) {
                return this.js.call(this, code);
            },
            css: function (code) {
                let result = new cleanCSS().minify(code);
                if (result.errors.length) {
                    return code;
                }
                return result.styles;
            },
            ux: function (code) {
                return code;
            },
            wxml: function (code) {
                //TODO: comporess xml file;
                return code;
            },
            json: function (code) {
                return JSON.stringify(JSON.parse(code));
            }
        };
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
    decodeChinise: require('./decodeChinese'),
    isWebView(fileId) {
        if (config.buildType != 'quick') {
            return false;
        }

        if ( !(config.webview && config.webview.pages.length) ) {
            return false;
        }
       
        let isWebView =
            config.webview.pages.includes(fileId) ||
            config.webview.pages.some((reg) => {
                //如果是webview设置成true, 则用增则匹配
                return Object.prototype.toString.call(reg) === '[object RegExp]' &&
                    reg.test(fileId)
            });
        return isWebView;
    },
    parseCamel: toUpperCamel,//转换为大驼峰风格
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
    isWin: function(){
        return isWindow
    },
    sepForRegex: isWindow ? `\\${path.win32.sep}` : path.sep,
    fixWinPath(p) {
        return p.replace(/\\/g, '/');
    },
};

module.exports = utils;
