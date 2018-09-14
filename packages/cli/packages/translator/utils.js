const t = require('babel-types');
const fs = require('fs-extra');
const path = require('path');
const cwd = process.cwd();
const chalk = require('chalk');
const spawn = require('cross-spawn');
const useYarn = require('../utils/index').useYarn();
const useCnpm = require('../utils/index').useCnpm();

module.exports = {
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
        if (useYarn){
            bin = 'yarn';
            options.push('add', '--exact', pkg, '--save');
            
        } else if (useCnpm){
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
    sepForRegex: process.platform === 'win32' ? `\\${path.win32.sep}` : path.sep
};
