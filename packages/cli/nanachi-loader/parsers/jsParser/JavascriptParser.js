const path = require('path');
const fs = require('fs');
const babel = require('@babel/core');
const cwd = process.cwd();

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
                            // TODO: 处理node_modules -> npm
                            if (/^(\/|\.|\w)/.test(moduleName) ) {
                                return moduleName;
                            }
                            // if (/^\w/.test(moduleName)) {
                            //     moduleName = 'source/npm' + moduleName;
                            // }
                            moduleName = moduleName.replace(/^(@\w+)/, function(match, alias) {
                                return aliasMap[alias] || alias;
                            });
                            moduleName = path.resolve(cwd, moduleName);
                            return getRelativePath(path.dirname(from), moduleName);
                        }
                    }
                ]
            ]
        });
        // traverse(this.ast, {
        //     ImportDeclaration(astPath, state) {
        //         const node = astPath.node;
        //         node.source.value = node.source.value.replace(/^(@\w+)/, function(match, alias, str) {
        //             return aliasMap[alias] || alias;
        //         });
        //         if (/^source/.test(node.source.value)) {
        //             node.source.value = path.resolve(cwd, node.source.value);
        //             node.source.value = getRelativePath(path.dirname(from), node.source.value);
        //         }
        //     }

        // });
        // return generate(this.ast).code;
        return result.code;
    }
}

module.exports = JavascriptParser;