const path = require('path');
const fs = require('fs');
const babel = require('@babel/core');

const removeAst = (ast) => { ast.remove(); }

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
        this.componentType = null;
        this.setComponentType();
    }
    setComponentType() {
        if (
            /\/components\//.test(this.filepath)                
        ) {
            this.componentType = 'Component';
        } else if (/\/pages\//.test(this.filepath)) {
            this.componentType = 'Page';
        } else if (/app\.js$/.test(this.filepath)) {
            this.componentType = 'App';
        }
    }
    
    async parse() {
        const res = await babel.transformFileAsync(this.filepath, this._babelPlugin);
        this.extraModules = res.options.anu && res.options.anu.extraModules || this.extraModules;
        this.parsedCode = res.code;
        this.ast = res.ast;
        return res;
    }
    getCodeForWebpack() {
        const res = babel.transformFromAstSync(this.ast, null, {
            plugins: [
                function() {
                    return {
                        visitor: {
                            // 移除所有jsx，对webpack解析无用
                            JSXElement: removeAst,
                            ClassProperty: removeAst
                        }
                    };
                }
            ]
        });
        return res.code;
    }

    getExtraFiles() {
        return this.queues;
    }

    getExportCode() {
        let res = this.getCodeForWebpack();
        // modules去重
        this.extraModules = this.extraModules.filter((m, i, self) => {
            return self.indexOf(m) === i;
        });
        this.extraModules.forEach(module => {
            // windows 补丁
            module = module.replace(/\\/g, '\\\\');
            res = `import '${module}';\n` + res;
        });
        return res;
    }
}

module.exports = JavascriptParser;