
const execSync = require('child_process').execSync;
const t = require('babel-types');
const fs = require('fs-extra');
const path = require('path');
const cwd = process.cwd();
const chalk = require('chalk');
const spawn = require('cross-spawn');
const config = require('../config');

var resolveP  = require('babel-plugin-module-resolver').default;
let utils = {
    getNodeVersion(){
        return Number(process.version.match(/v(\d+)/)[1]);
    },
    useYarn(){
        if (config['useYarn'] != undefined){
            return config['useYarn'];
        }
        try {
            execSync(
                'yarn --version',
                { stdio: 'ignore' }
            );
            config['useYarn'] = true;
           
        } catch (e) {
            config['useYarn'] = false;
           
        }
        return config['useYarn'];
    },
    useCnpm(){
        if (config['useCnpm'] != undefined){
            return config['useCnpm'];
        }
        try {
            execSync(
                'cnpm -v',
                { stdio: 'ignore' }
            );
            config['useCnpm'] = true;
           
        } catch (e) {
            config['useCnpm'] = false;
           
        }
        return config['useCnpm'];
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
    isNpm(name){
        if (!name || typeof name !== 'string') return false;
        return /^\/|\./.test(name);  //require('/name') || require('./name') || require('../name')
    },
    isBuildInLibs(name){
        let libs = new Set(require('repl')._builtinLibs);
        return libs.has(name);
    },
    isAlias(name){
        //require('a/b/c') or require('a');
        let nameAry = name.split('/');
        let pkg = require(path.join(cwd, 'package.json'));
        let alias = pkg.mpreact ? (pkg.mpreact.alias || {}) : {};
        if (alias[nameAry[0]]){
            return true;
        } else {
            return false;
        }
    },
    installer(pkg, cb){
        let bin = '';
        let options = [];
        if (this.useYarn()){
            bin = 'yarn';
            options.push('add', '--exact', pkg, '--save');
            
        } else if (this.useCnpm()){
            bin = 'cnpm';
            options.push('install', pkg, '--save');
        } else {
            bin = 'npm';
            options.push('install', pkg, '--save');
        }

        let result = spawn.sync(bin, options, { stdio: 'inherit' });
        if (result.error) {
            // eslint-disable-next-line
            console.log(result.error);
            process.exit(1);
        }
        // eslint-disable-next-line
        console.log(chalk.green(`${pkg}安装成功\n`));
        cb && cb();

    },
    isAlias(name){
        return !/^(\.|\/)/.test(name);
    },
    getAlias(){
        let aliasField = require(path.join(cwd, 'package.json')).mpreact.alias;
        let aliasConfig = {};
        for (let key in aliasField) {
            aliasConfig[key] = path.resolve(cwd, aliasField[key]);
        }
        //npm依赖中存在react引用时，也需要配置alias;
        aliasConfig = Object.assign(aliasConfig, {'react': aliasConfig['@react']});
        return aliasConfig;
    },
    resolveNpmAlias(id, depFile){
        let distJs = id.replace(/\/src\//, '/dist/');
        let distNpm = depFile.replace(/\/node_modules\//, '/dist/npm/');


        //根据被依赖文件和依赖文件，求相对路径
        let aliasPath = path.relative( path.dirname(distJs),  distNpm);
        return aliasPath;
    },
    resolveCustomAlias(id, depFile){
        let aliasPath = path.relative( path.dirname(id),  depFile);
        return aliasPath;
    },
    resolveAlias(id, deps){
        
        let resolvedAlias = {};
         

           

        Object.keys(deps).forEach((aliasName)=>{

            /**
             * 自定义别名与npm模块路径处理本质上都可以作为alias配置处理, 例如:
             * @components/xx         //自定义别名
             * @react                 //自定义别名
             * react-redux            //npm模块
             * @rematch/core          //npm模块
             */
            if (!this.isAlias(aliasName)) return false;


            //to do: windows路径处理
            let dep = deps[aliasName];
            let resolvedPath = '';
            
            /**
             * 处理别名分两种情况
             * 1: 处理自定理的alias路径配置
             * 2: 处理依赖node_modules的相对路径
             */


            if (/\/node_modules\//.test(dep)){
                resolvedPath = this.resolveNpmAlias(id, dep);
            } else {
                resolvedPath = this.resolveCustomAlias(id, dep);
            }
           
            resolvedAlias[aliasName] = resolvedPath;



        });

        return resolvedAlias;

    },
    sepForRegex: process.platform === 'win32' ? `\\${path.win32.sep}` : path.sep
};

module.exports = Object.assign(module.exports, utils);