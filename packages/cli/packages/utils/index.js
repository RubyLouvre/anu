/* eslint no-console: 0 */
/* eslint-disable*/
const execSync = require('child_process').execSync;
const t = require('@babel/types');
const fs = require('fs-extra');
const path = require('path');
const cwd = process.cwd();
const chalk = require('chalk');
const spawn = require('cross-spawn');
const uglifyJS = require('uglify-es');
const cleanCSS = require('clean-css');
const nodeResolve = require('resolve');
const template = require('@babel/template').default;
const axios = require('axios');
const ora = require('ora');
const EventEmitter = require('events').EventEmitter;
const config = require('../config');
const Event = new EventEmitter();
const pkg = require(path.join(cwd, 'package.json'));
const queue = require('../queue');
const userConfig = pkg.nanachi || pkg.mpreact || {};
const generate = require('@babel/generator').default;
process.on('unhandledRejection', error => {
    // eslint-disable-next-line
    console.error('unhandledRejection', error);
    process.exit(1); // To exit with a 'failure' code
});
// 这里只处理多个平台会用的方法， 只处理某一个平台放到各自的helpers中
let utils = {
    on() {
        Event.on.apply(global, arguments);
    },
    emit() {
        Event.emit.apply(global, arguments);
    },
    getNodeVersion() {
        return Number(process.version.match(/v(\d+)/)[1]);
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
    useCnpm() {
        if (config['useCnpm'] != undefined) {
            return config['useCnpm'];
        }
        try {
            execSync('cnpm -v', {
                stdio: 'ignore'
            });
            config['useCnpm'] = true;
        } catch (e) {
            config['useCnpm'] = false;
        }
        return config['useCnpm'];
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
        if (buildType === 'quick') {
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
        const patchNode = config[config.buildType].jsxPatchNode || {};
        const UIName = 'schnee-ui';
        const cache = {};
        //这用于wxHelpers/nodeName.js, quickHelpers/nodeName.js
        return (astPath, modules) => {
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

                if (!cache[orig]) {
                    let patchPath = path.join(cwd, 'node_modules', UIName, 'components', patchName, 'index.js');
                    this.emit('compliePatch', patchPath); //再次经过编译
                    cache[orig] = true;
                }
                return patchName;
            }
            return (astPath.node.name.name = map[orig] || backup);
        }
    },
    getUsedComponentsPath(bag, nodeName, modules) {
        let isNpm = this.isNpm(bag.source);
        let sourcePath = modules.sourcePath;
        let isNodeModulePathReg = this.isWin() ? /\\node_modules\\/ : /\/node_modules\//;

        //引用的npm ui库 
        //import { xxx } from 'schnee-ui';
        if (isNpm) {
            return '/npm/' + bag.source + '/components/' + nodeName + '/index';
        }
        //在ui components中可能存在相对引用其他components
        //如果XPicker中存在 import XOverlay from '../XOverlay/index';
        if (
            isNodeModulePathReg.test(sourcePath) &&
            /^\./.test(bag.source)
        ) {
            //获取用组件的绝对路径 ==> /path/xxx/node_modules/schnee-ui/components/XOverlay/index
            let importerAbPath = path.join(path.dirname(modules.sourcePath), bag.source);
            // ==>/npm/schnee-ui/components/XOverlay/index
            return '/npm/' + importerAbPath.split(`${path.sep}node_modules${path.sep}`)[1]
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
    copyCustomComponents(conf, modules) {
        Object.keys(conf).forEach(componentName => {
            //对usingComponents直接copy目录
            let componentDir = path.dirname(conf[componentName]);
            let src = path.join(cwd, config.sourceDir, componentDir);
            let dest = path.join(cwd, 'dist', componentDir);
            let list = modules.customComponents;
            fs.ensureDirSync(dest);
            fs.copySync(src, dest);
            if (!list.includes(componentName)) list.push(componentName);
        });
    },
    isNpm(name) {
        // ./
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
    isBuildInLibs(name) {
        let libs = new Set(require('repl')._builtinLibs);
        if (libs.has(name)) {
            //如果是内置模块，先查找本地node_modules是否有对应重名模块
            let isLocalBuildInLib = /\/node_modules\//.test(nodeResolve.sync(name, {
                basedir: cwd
            }));
            if (isLocalBuildInLib) {
                return false;
            } else {
                return true;
            }
        }
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
    installDeps(missModules) {
        /**
         * installMap: { npmName: importerPath }
         */
        return Promise.all(
            missModules.map(async item => {
                let npmPath = await this.installer(item.resolveName);
                return {
                    id: npmPath, //缺失npm模块绝对路径
                    npmName: item.resolveName, //缺失模块名
                    importerPath: item.id, //依赖该缺失模块的文件路径
                    originalCode: fs.readFileSync(npmPath).toString()
                };
            })
        );
    },
    async getReactLibPath(isBeta) {
        let React = this.getReactLibName();
        let reactTargetPath = path.join(cwd, config.sourceDir, React);
        if (isBeta) {
            let spinner = this.spinner(`正在下载最新的${React}`);
            spinner.start();
            let remoteUrl = `https://raw.githubusercontent.com/RubyLouvre/anu/branch3/dist/${React}`;
            let ReactLib = await axios.get(remoteUrl);
            fs.ensureFileSync(reactTargetPath);
            fs.writeFileSync(reactTargetPath, ReactLib.data);
            spinner.succeed(`下载${React}成功`);
        } else {
            try {
                nodeResolve.sync(reactTargetPath, {
                    basedir: cwd,
                    moduleDirectory: path.join(cwd, config.sourceDir)
                });
            } catch (err) {
                let ReactLibPath = path.join(__dirname, '..', '..', 'lib', `${React}`);
                fs.copyFileSync(ReactLibPath, reactTargetPath);
            }
        }
        return reactTargetPath;
    },
    async asyncReact(option) {
        await this.getReactLibPath(option);
        let ReactLibName = this.getReactLibName();
        let map = this.getReactMap();
        Object.keys(map).forEach(key => {
            let ReactName = map[key];
            if (ReactName != ReactLibName) {
                fs.remove(path.join(cwd, config.sourceDir, ReactName), err => {
                    if (err) {
                        console.log(err);
                    }
                });
                fs.remove(path.join(cwd, 'dist', ReactName), err => {
                    if (err) {
                        console.log(err);
                    }
                });
            }
        });
    },
    getReactMap() {
        return {
            wx: 'ReactWX.js',
            ali: 'ReactAli.js',
            bu: 'ReactBu.js',
            quick: 'ReactQuick.js',
            h5: 'ReactH5.js',
            tt: 'ReactWX.js'
        };
    },
    getReactLibName() {
        let buildType = config.buildType;
        return this.getReactMap()[buildType];
    },
    getAliasConfig() {
        let React = this.getReactLibName();
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
    mergeQuickAppJson: function () {
        let projectPkgPath = path.join(cwd, 'package.json');
        let projectPkg = require(projectPkgPath);
        let quickPkg = require(path.join(
            __dirname,
            '..',
            'quickHelpers',
            'quickInitConfig',
            'package.json'
        ));

        projectPkg.scripts = projectPkg.scripts || {};
        projectPkg.devDependencies = projectPkg.devDependencies || {};

        Object.assign(projectPkg.scripts, quickPkg.scripts); //注入快应用scripts命令
        Object.assign(projectPkg.devDependencies, quickPkg.devDependencies); //注入快应用开发依赖
        fs.writeFileSync(projectPkgPath, JSON.stringify(projectPkg, null, 4));
    },
    initQuickAppConfig: function () {
        //merge快应用依赖的package.json配置
        this.mergeQuickAppJson();
        let baseDir = path.join(__dirname, '..', 'quickHelpers', 'quickInitConfig');

        //copy快应用秘钥
        let signSourceDir = path.join(baseDir, 'sign');
        let signDistDir = path.join(cwd, 'sign');
        let babelConifgPath = path.join(baseDir, 'babel.config.js');
        let babelConfigDist = path.join(cwd, 'babel.config.js');

        fs.ensureDirSync(signDistDir);
        fs.copy(signSourceDir, signDistDir).catch(err => {
            // eslint-disable-next-line
            console.log(err);
        });

        fs.ensureFileSync(babelConifgPath);
        fs.copy(babelConifgPath, babelConfigDist).catch(err => {
            // eslint-disable-next-line
            console.log(err);
        });
    },
    cleanDir: function () {
        let fileList = ['package-lock.json', 'yarn.lock'];
        config.buildType === 'quick' ?
            (fileList = fileList.concat([config.buildDir])) :
            (fileList = fileList.concat(['dist', 'build', 'sign', 'src']));
        fileList.forEach(item => {
            try {
                fs.removeSync(path.join(cwd, item));
            } catch (err) {
                // eslint-disable-next-line
                console.log(err);
            }
        });
    },
    compress: function () {
        return {
            js: function (code) {
                let result = uglifyJS.minify(code);
                if (result.error) {
                    throw result.error;
                }
                return result.code;
            },
            npm: function (code) {
                return this.js.call(this, code);
            },
            css: function (code) {
                let result = new cleanCSS().minify(code);
                if (result.errors.length) {
                    throw result.errors;
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
    decodeChinise(code) {
        return code.replace(/\\?(?:\\u)([\da-f]{4})/gi, function (a, b) {
            return unescape(`%u${b}`);
        });
    },
    setWebViewConfig(routes) {
        let code = `module.exports = ${JSON.stringify(routes)};`;
        queue.push({
            code: code,
            type: 'js',
            path: path.join(process.cwd(), 'dist', 'webviewConfig.js')
        });
    },
    getWebViewRoutesConfig(jsFiles) {
        let ret = {},
            pkg = null,
            host = '';
        try {
            pkg = require(path.join(cwd, 'package.json'));
        } catch (err) {

        }
        if (pkg && pkg.nanachi) {
            host = pkg.nanachi.H5_HOST
        }

        if (!host) {
            console.log(chalk.red('Error: H5请在package.json中nanachi字段里配置H5_HOST字段'));
            process.exit(1);
        }

        jsFiles.forEach((el) => {
            let route = path.relative(path.join(cwd, config.sourceDir), el.id).replace(/\.js$/, '');
            ret[route] = host + '/' + route;

        })
        return ret;
    },
    setH5CompileConfig(jsFiles) {
        let H5_COMPILE_JSON_FILE = path.join(cwd, config.sourceDir, 'H5_COMPILE_CONFIG.json');
        fs.ensureFileSync(H5_COMPILE_JSON_FILE)
        fs.writeFileSync(
            H5_COMPILE_JSON_FILE,
            JSON.stringify({
                webviewPages: jsFiles.map((item) => {
                    return item.id
                })
            })
        )
    },
    deleteWebViewConifg() {
        let list = [
            'H5_COMPILE_CONFIG.json',
            'webviewConfig.js'
        ];
        list = list.map((file) => {
            return path.join(cwd, config.sourceDir, file);
        });

        list.forEach((fileId) => {
            try {
                fs.removeSync(fileId);
            } catch (err) {}
        })

    },
    isWebView(fileId) {
        if (config['buildType'] != 'quick' && !config['webview']) return;
        if (!config['webview']) return;
        let isWebView =
            config['webview'].includes(fileId) ||
            config['webview'].some((reg) => {
                //如果是webview设置成true, 则用增则匹配
                return Object.prototype.toString.call(reg) === '[object RegExp]' &&
                    reg.test(fileId)
            });
        return isWebView;
    },
   

    sepForRegex: process.platform === 'win32' ? `\\${path.win32.sep}` : path.sep
};




module.exports = Object.assign(module.exports, utils);