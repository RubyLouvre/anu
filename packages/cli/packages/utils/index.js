/* eslint no-console: 0 */

const execSync = require('child_process').execSync;
const t = require('babel-types');
const fs = require('fs-extra');
const path = require('path');
const cwd = process.cwd();
const chalk = require('chalk');
const spawn = require('cross-spawn');
const uglifyJS = require('uglify-es');
const cleanCSS = require('clean-css');
const nodeResolve = require('resolve');
const template = require('babel-template');
const axios = require('axios');
const ora = require('ora');
const EventEmitter = require('events').EventEmitter;
const config = require('../config');
const Event = new EventEmitter();
process.on('unhandledRejection', error => {
    // eslint-disable-next-line
    console.error("unhandledRejection", error);
    process.exit(1); // To exit with a 'failure' code
});
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
            execSync('yarn --version', { stdio: 'ignore' });
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
            execSync('cnpm -v', { stdio: 'ignore' });
            config['useCnpm'] = true;
        } catch (e) {
            config['useCnpm'] = false;
        }
        return config['useCnpm'];
    },
    shortcutOfCreateElement() {
        return 'var h = React.createElement;';
    },
    getEventName(eventName, nodeName, buildType) {
        if (eventName == 'Click' || eventName == 'Tap') {
            if (
                buildType === 'ali' ||
                buildType === 'wx' ||
                buildType === 'bu'
            ) {
                return 'Tap';
            } else {
                return 'Click';
            }
        }
        if (nodeName == 'input' && eventName == 'Change') {
            if (buildType === 'ali') {
                return 'Input';
            } else if (buildType === 'wx') {
                return 'Change';
            }
        }
        return eventName;
    },
    createElement(nodeName, attrs, children) {
        return t.JSXElement(
            t.JSXOpeningElement(t.JSXIdentifier(nodeName), attrs, config.buildType === 'quick' ? false: !children.length),
            t.jSXClosingElement(t.JSXIdentifier(nodeName)),
            children
        );
    },
    createNodeName(map, backup){
        const buildType = config.buildType;
        const patchComponents = config[buildType].patchComponents;
        const _this = this;
        //这用于wxHelpers/nodeName.js, quickHelpers/nodeName.js
        return function(astPath, modules){
            var orig = astPath.node.name.name;
            var hasPatch = patchComponents && patchComponents[orig];
            
            //组件补丁
            if (hasPatch) {
                var newName = hasPatch.name;
                astPath.node.name.name = newName;  //{button: {name :'Button', href:''}}
                modules.importComponents[newName] = {
                    source: `/@components/${newName}/index`,
                };
                _this.emit('compliePatch', hasPatch);
                return newName;
            } 
            
            //如果是native组件,  组件jsx名小写
            if ( map[orig.toLowerCase()] ) {
                orig = orig.toLowerCase();
                return  astPath.node.name.name = (map[orig] || backup);
            }

            //普通业务组件
            if ( new RegExp(`/${orig}/`).test(modules.source) ) {
                astPath.node.name.name = 'React.useComponent';
            }
            
        };
    },
    createAttribute(name, value) {
        return t.JSXAttribute(
            t.JSXIdentifier(name),
            typeof value == 'object' ? value : t.stringLiteral(value)
        );
    },
    createUUID(astPath) {
        return astPath.node.start + astPath.node.end;
    },
    genKey(key) {
        key = key + '';
        if (/\{\{/.test(key)) {
            key = key.slice(2, -2);
        }
        return key.indexOf('.') > 0 ? key.split('.').pop() : '{{index}}';
    },
    getAnu(state) {
        return state.file.opts.anu;
    },
    isLoopMap(astPath) {
        if (
            t.isJSXExpressionContainer(astPath.parentPath) ||
            t.isConditionalExpression(astPath.parentPath)
        ) {
            var callee = astPath.node.callee;
            return (
                callee.type == 'MemberExpression' &&
                callee.property.name === 'map'
            );
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
        if (!name || typeof name !== 'string') return false;
        return !/^\/|\./.test(name);
    },
    createRegisterStatement(className, path, isPage) {
        var templateString = isPage
            ? 'Page(React.registerPage(className,astPath))'
            : 'Component(React.registerComponent(className,astPath))';
        return template(templateString)({
            className: t.identifier(className),
            astPath: t.stringLiteral(path)
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
        var lastSegement = '', replaced = false;
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
        if (resolvedPath[0] != '/') {
            resolvedPath = '/' + resolvedPath;
        }
        return resolvedPath;
    },
    isBuildInLibs(name) {
        let libs = new Set(require('repl')._builtinLibs);
        if (libs.has(name)) {
            //如果是内置模块，先查找本地node_modules是否有对应重名模块
            let isLocalBuildInLib = /\/node_modules\//.test(
                nodeResolve.sync(name, { basedir: cwd })
            );
            if (isLocalBuildInLib) {
                return false;
            } else {
                return true;
            }
        }
    },
    installer(npmName, dev) {
        return new Promise(resolve => {
            console.log(
                chalk.red(`缺少依赖: ${npmName}, 正在自动安装中, 请稍候`)
            );
            let bin = '';
            let options = [];
            if (this.useYarn()) {
                bin = 'yarn';
                options.push('add', npmName, dev === 'dev' ? '--dev' : '--save');
            } else if (this.useCnpm()) {
                bin = 'cnpm';
                options.push('install', npmName, dev === 'dev' ? '--save-dev' : '--save');
            } else {
                bin = 'npm';
                options.push('install', npmName, dev === 'dev' ? '--save-dev' : '--save');
            }

            let result = spawn.sync(bin, options, { stdio: 'inherit' });
            if (result.error) {
                console.log(result.error);
                process.exit(1);
            }
            console.log(chalk.green(`${npmName}安装成功\n`));

            //获得自动安装的npm依赖模块路径
            let npmPath = nodeResolve.sync(npmName, {
                basedir: cwd,
                moduleDirectory: path.join(cwd, 'node_modules'),
                packageFilter: pkg => {
                    if (pkg.module) {
                        pkg.main = pkg.module;
                    }
                    return pkg;
                }
            });
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
    async getReactLibPath() {
        let reactPath = '';
        let React = this.getReactLibName();
        console.log('getReactLibPath', React);
        let srcPath = path.join(cwd, config.sourceDir, React);
        try {
            reactPath = nodeResolve.sync(srcPath, {
                basedir: cwd,
                moduleDirectory: path.join(cwd, config.sourceDir)
            });
        } catch (err) {
            let spinner = this.spinner(`正在下载最新的${React}`);
            spinner.start();
            let remoteUrl = `https://raw.githubusercontent.com/RubyLouvre/anu/branch3/dist/${React}`;
            let ReactLib = await axios.get(remoteUrl);
            fs.ensureFileSync(srcPath);
            fs.writeFileSync(srcPath, ReactLib.data);
            spinner.succeed(`下载${React}成功`);
            reactPath = path.join(cwd, config.sourceDir, React);
        }
        return reactPath;
    },

    async asyncReact() {
        await this.getReactLibPath();

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
    getCustomAliasConfig() {
        let React = this.getReactLibName();
        let defaultAlias = {
            'react': path.join(cwd, `${config.sourceDir}/${React}`),
            '@react': path.join(cwd, `${config.sourceDir}/${React}`),
            '@components': path.join(cwd, `${config.sourceDir}/components`)
        };
        let pkg = require(path.join(cwd, 'package.json'));
        let pkgAlias = pkg.mpreact && pkg.mpreact.alias ? pkg.mpreact.alias : {};


        Object.keys(pkgAlias).forEach((aliasKey) => {
            //@components, @react无法自定义配置
            if (!defaultAlias[aliasKey]) {
                defaultAlias[aliasKey] = path.join(cwd, pkgAlias[aliasKey]);
            }
        });
        return defaultAlias;
    },
    resolveNpmAliasPath(id, depFile) {
        let distJs = id.replace(new RegExp('/' + config.sourceDir + '/'), '/dist/');
        let distNpm = depFile.replace(/\/node_modules\//, '/dist/npm/');

        //根据被依赖文件和依赖文件，求相对路径
        let aliasPath = path.relative(path.dirname(distJs), distNpm);

        return aliasPath;
    },
    resolveCustomAliasPath(file, depFile) {
        let aliasPath = path.relative(path.dirname(file), depFile);
        return aliasPath;
    },
    replacePath: function (sPath, segement, newSegement) {
        let sep = path.sep;
        if (process.platform === 'win32') {
            segement = segement.replace(/\//g, sep);
            newSegement = newSegement.replace(/\//g, sep);
        }
        return path.resolve(sPath.replace(segement, newSegement));
    },
    updateNpmAlias(id, deps) {
        //依赖的npm模块也当alias处理
        let result = {};
        let aliasConfig = Object.keys(this.getCustomAliasConfig()).join('|');
        let reg = new RegExp(`^(${aliasConfig})`);
        Object.keys(deps).forEach(depKey => {
            if (
                !this.isBuildInLibs(depKey) &&
                this.isNpm(depKey) &&
                !reg.test(depKey)
            ) {
                result[depKey] = this.resolveNpmAliasPath(id, deps[depKey]);
            }
        });
        return result;
    },
    updateCustomAlias(id, deps) {
        //自定义alias是以@react和@components开头
        let aliasConfig = Object.keys(this.getCustomAliasConfig()).join('|');
        let reg = new RegExp(`^(${aliasConfig})`); // /^(@react|@components|...)/
        let result = {};
        Object.keys(deps).forEach(depKey => {
            if (reg.test(depKey)) {
                result[depKey] = this.resolveCustomAliasPath(id, deps[depKey]);
            }
        });
        return result;
    },
    asyncAwaitHackPlugin: function(buildType){
        let visitor = {
            FunctionDeclaration: {
                exit(astPath) {
                    //微信，百度小程序async/await语法需要插入var regeneratorRuntime = require('regenerator-runtime/runtime');
                    let name = astPath.node.id.name;
                    if (name === '_asyncToGenerator' && ['wx', 'bu'].includes(buildType) ) {
                        astPath.insertBefore(
                            t.variableDeclaration('var', [
                                t.variableDeclarator(
                                    t.identifier('regeneratorRuntime'),
                                    t.callExpression(t.identifier('require'), [
                                        t.stringLiteral('regenerator-runtime/runtime')
                                    ])
                                )
                            ])
                        );
                    }
                }
            }
        };
        return function(){
            return {
                visitor: visitor
            };
        };
    },
    getRegeneratorRuntimePath: function (sourcePath) {
        //小程序async/await语法依赖regenerator-runtime/runtime
        try {
            return nodeResolve.sync('regenerator-runtime/runtime', { basedir: process.cwd() });
        } catch (err) {
            // eslint-disable-next-line
            console.log(
                'Error: ' + sourcePath + '\n' +
                'Msg: ' + chalk.red('async/await语法缺少依赖 regenerator-runtime ,请安装')
            );
        }
    },
    mergeQuickAppJson: function () {
        let prevPkgPath = path.join(cwd, 'package.json');
        let prevpkg = require(prevPkgPath);
        let quickPkg = require(path.join(__dirname, '..', 'quickHelpers', 'quickInitConfig', 'package.json') );
        let mergeJsonResult = {
            ...prevpkg,
            ...quickPkg
        };
        fs.writeFile(prevPkgPath, JSON.stringify(mergeJsonResult, null, 4))
            .catch((err)=>{
                // eslint-disable-next-line
                console.log(err);
            });
    },
    initQuickAppConfig: function(){
        //merge快应用依赖的package.json配置
        this.mergeQuickAppJson();
        
        //copy快应用秘钥
        let signSourceDir = path.join(__dirname, '..', 'quickHelpers', 'quickInitConfig', 'sign');
        let signDistDir = path.join(cwd, 'sign');
        fs.ensureDirSync(signDistDir);
        fs.copy( signSourceDir, signDistDir)
            .catch((err)=>{
                // eslint-disable-next-line
                console.log(err);
            });
    },
    resolvePatchComponentPath: function(filePath){
        //patchComponent路径在cli中, 需要处理成souces/components/...
        let isPatchComponentReg = utils.isWin() ? /\\patchComponents\\/ : /\/patchComponents\//;
        if (isPatchComponentReg.test(filePath)) {
            let dirLevel = path.dirname(filePath).split(path.sep);
            filePath = path.join(cwd, config.sourceDir, 'components', dirLevel[dirLevel.length-1], path.basename(filePath));
        }
        return filePath;
    },
    cleanDir: function(){
        let fileList = ['package-lock.json', 'yarn.lock'];
        config.buildType === 'quick'
            ? fileList = fileList.concat([ config.buildDir ])
            : fileList = fileList.concat( [ 'dist', 'build', 'sign', 'src' ] );
        fileList.forEach((item)=>{
            try {
                fs.removeSync(path.join(cwd, item));
            } catch (err){
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
    getComponentOrAppOrPageReg() {
        return new RegExp(this.sepForRegex + '(?:pages|app|components|patchComponents)');
    },
    sepForRegex: process.platform === 'win32' ? `\\${path.win32.sep}` : path.sep
};

module.exports = Object.assign(module.exports, utils);
