const path = require('path');
const fs = require('fs');
const babel = require('@babel/core');
const cwd = process.cwd();
const nodeResolve = require('resolve');

const getRelativePath = (from, to) => {
    return path.relative(from, to).replace(/^(?=[^.])/, './'); // ReactQuick -> ./ReactQuick
};

class JavascriptParser {
    constructor({
        code,
        map,
        meta,
        filepath,
        platform
    }) {
        this.map = map;
        this.meta = meta;
        this.filepath = filepath;
        this.code = code || fs.readFileSync(this.filepath, 'utf-8');
        this.platform = platform;
        this.relativePath = path.relative(path.resolve(process.cwd(), 'source'), filepath);
        if (/node_modules/.test(filepath)) {
            this.relativePath = path.join('npm', path.relative(path.resolve(process.cwd(), 'node_modules'), filepath));
        } else {
            this.relativePath = path.relative(path.resolve(process.cwd(), 'source'), filepath);
        }
        this._babelPlugin = {};
        this.queues = [];
        this.extraModules = [];
        this.parsedCode = '';
        this.ast = null;
    }
    
    async parse() {
        const res = await babel.transformFileAsync(this.filepath, this._babelPlugin);
        this.extraModules = res.options.anu && res.options.anu.extraModules || this.extraModules;
        this.parsedCode = res.code;
        this.ast = res.ast;
        return res;
    }

    getExtraFiles() {
        return this.queues;
    }

    getExportCode() {
        let res = this.parsedCode;
        this.extraModules.forEach(module => {
            // windows 补丁
            module = module.replace(/\\/g, '\\\\');
            res = `import '${module}';\n` + res;
        });
        return res;
    }
    resolveAlias() {
        const aliasMap = require('../../../consts/alias')(this.platform);
        const from = path.resolve(cwd, 'source', this.relativePath);

        const result = babel.transformFromAstSync(this.ast, null, {
            configFile: false,
            babelrc: false,
            comments: false,
            ast: true,
            plugins: [
                [
                    require('babel-plugin-module-resolver'),        //计算别名配置以及处理npm路径计算
                    {
                        resolvePath(moduleName) {
                            if (/^\./.test(moduleName)) {
                                return moduleName;
                            }
                            // 替换别名
                            moduleName = moduleName.replace(/^[@-\w]+/, function(alias) {
                                return aliasMap[alias] || alias;
                            });
                            // 如果是 import babel from '@babel' 这种node_modules引入，处理路径 node_modules -> npm
                            if (/^(?=[^./\\])/.test(moduleName)) {
                                try {
                                    const nodePath = nodeResolve.sync(moduleName, {
                                        basedir: cwd
                                    });
                                    moduleName = path.resolve(cwd, 'source/npm', path.relative(path.resolve(cwd, 'node_modules'), nodePath));
                                } catch (e) {
                                    // eslint-disable-next-line
                                    console.log(e);
                                    return;
                                }
                            } else {
                                moduleName = path.resolve(cwd, moduleName);
                            }

                         
                            return getRelativePath(path.dirname(from), moduleName).replace(/\\/g, '/');
                        }
                    }
                ]
            ]
        });
        return result.code;
    }
}

module.exports = JavascriptParser;