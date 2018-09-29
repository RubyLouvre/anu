const execSync = require('child_process').execSync;
const t = require('babel-types');
const fs = require('fs-extra');
const path = require('path');
const cwd = process.cwd();
const chalk = require('chalk');
const spawn = require('cross-spawn');
const nodeResolve = require('resolve');
const config = require('../config');
const template = require('babel-template');
const EventEmitter = require('events').EventEmitter;
const Event = new EventEmitter();

let utils = {
    on() {
        Event.on.apply(this, arguments);
    },
    emit() {
        Event.emit.apply(this, arguments);
    },
    createChineseHack: require('./chinese'),
    getNodeVersion() {
        return Number(process.version.match(/v(\d+)/)[1]);
    },
    getStyleValue: require('./getStyleValue'),
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
    shortcutOfCreateElement(){
        return 'var h = React.createElement;';
    },
    getEventName(eventName, nodeName, buildType) {
        if (eventName == 'Click' || eventName == 'Tap'){
            if (buildType === 'ali' || buildType === 'wx' || buildType === 'bu'){
                return 'Tap';
            } else {
                return 'Click';
            }
        }
        if (nodeName == 'input' && eventName == 'Change'){
            if (buildType === 'ali'){
                return 'Input';
            } else if (buildType === 'wx'){
                return 'Change';
            }
        }
        return eventName;
    },
    
    createElement(nodeName, attrs, children) {
        return t.JSXElement(
            t.JSXOpeningElement(t.JSXIdentifier(nodeName), attrs, false),
            t.jSXClosingElement(t.JSXIdentifier(nodeName)),
            children
        );
    },
    createAttribute(name, value) {
        return t.JSXAttribute(
            t.JSXIdentifier(name),
            typeof value == 'object' ? value : t.stringLiteral(value)
        );
    },
    isRenderProps(attrValue) {
        if (
            attrValue.expression &&
            attrValue.type == 'JSXExpressionContainer'
        ) {
            var type = attrValue.expression.type;
            return (
                type == 'FunctionExpression' ||
                type === 'ArrowFunctionExpression'
            );
        }
        return false;
    },
    createUUID(astPath) {
        return astPath.node.start + astPath.node.end;
    },
    genKey(key) {
        key = key + '';
        if (/\{\{/.test(key)) {
            key = key.slice(2, -2);
        }
        return key.indexOf('.') > 0 ? key.split('.').pop() : '*this';
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
    exportExpr (name, isDefault) {
        if (isDefault == true) {
            return template(`module.exports.default = ${name};`)();
        } else {
            return template(`module.exports["${name}"] = ${name};`)();
        }
    },
    copyCustomComponents(config, modules) {
        Object.keys(config).forEach(componentName => {
            //对usingComponents直接copy目录
            let componentDir = path.dirname(config[componentName]);
            let src = path.join(cwd, 'src', componentDir);
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
    isBuildInLibs(name) {
        let libs = new Set(require('repl')._builtinLibs);
        return libs.has(name);
    },
    installer(npmName) {
        return new Promise(resolve => {
            // eslint-disable-next-line
            console.log(
                chalk.red(`缺少依赖: ${npmName}, 正在自动安装中, 请稍候`)
            );
            let bin = '';
            let options = [];
            if (this.useYarn()) {
                bin = 'yarn';
                options.push('add', '--exact', npmName, '--save');
            } else if (this.useCnpm()) {
                bin = 'cnpm';
                options.push('install', npmName, '--save');
            } else {
                bin = 'npm';
                options.push('install', npmName, '--save');
            }

            let result = spawn.sync(bin, options, { stdio: 'inherit' });
            if (result.error) {
                // eslint-disable-next-line
                console.log(result.error);
                process.exit(1);
            }
            // eslint-disable-next-line
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
    getCustomAliasConfig() {
        //搜集用户package.json中自定义的alias配置
        let aliasField = require(path.join(cwd, 'package.json')).mpreact.alias;
        let aliasConfig = {};
        for (let key in aliasField) {
            let value = path.resolve(cwd, aliasField[key]);
            aliasConfig[key] = value;
        }
        aliasConfig = Object.assign(aliasConfig, {
            react: aliasConfig['@react']
        });
        return aliasConfig;
    },
    resolveNpmAliasPath(id, depFile) {
        let distJs = id.replace(/\/src\//, '/dist/');
        let distNpm = depFile.replace(/\/node_modules\//, '/dist/npm/');

        //根据被依赖文件和依赖文件，求相对路径
        let aliasPath = path.relative(path.dirname(distJs), distNpm);
        
        return aliasPath;
    },
    resolveCustomAliasPath(file, depFile) {
        let aliasPath = path.relative(path.dirname(file), depFile);
        return aliasPath;
    },
    updateNpmAlias(id, deps) {
        //依赖的npm模块也当alias处理
        let result = {};
        Object.keys(deps).forEach(depKey => {
            if (
                !this.isBuildInLibs(depKey) &&
                this.isNpm(depKey) &&
                !/^(@react|@components)/.test(depKey)
            ) {
                result[depKey] = this.resolveNpmAliasPath(id, deps[depKey]);
            }
        });
        return result;
    },
    updateCustomAlias(id, deps) {
        //自定义alias是以@react和@components开头
        let customAliasReg = /^(@react|@components)/;
        let result = {};
        Object.keys(deps).forEach(depKey => {
            if (customAliasReg.test(depKey)) {
                result[depKey] = this.resolveCustomAliasPath(id, deps[depKey]);
            }
        });
        return result;
    },
    shortNameAlias: {
        h: {
            variableDeclarator: 'h',
            init: 'var h = React.createElement;'
        }
    },
    sepForRegex: process.platform === 'win32' ? `\\${path.win32.sep}` : path.sep
};

module.exports = Object.assign(module.exports, utils);
