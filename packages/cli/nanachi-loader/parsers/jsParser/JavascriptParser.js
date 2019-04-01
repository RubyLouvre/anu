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
    }
    
    async parse() {
        return await babel.transformFileAsync(this.filepath, this._babelPlugin);
    }
}

module.exports = JavascriptParser;