const path = require('path');
const fs = require('fs');
const babel = require('@babel/core');

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
        this._babelPlugin = {};
        this.queues = [];
        this.extraModules = [];
        this.parsedCode = '';
    }
    
    async parse() {
        const res = await babel.transformFileAsync(this.filepath, this._babelPlugin);
        this.extraModules = res.options.anu.extraModules;
        this.parsedCode = res.code;
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
}

module.exports = JavascriptParser;