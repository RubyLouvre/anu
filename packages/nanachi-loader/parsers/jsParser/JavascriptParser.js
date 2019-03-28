const path = require('path');

class JavascriptParser {
    constructor({
        code,
        map,
        meta,
        filepath,
        platform
    }) {
        this.code = code;
        this.map = map;
        this.meta = meta;
        this.filepath = filepath;
        this.platform = platform;
        this.relativePath = path.relative(path.resolve(process.cwd(), 'source'), filepath);
        this._instance = null;
    }
    
    parse() {
        return new Promise((resolve, reject) => {
            
        });
    }
}

module.exports = JavascriptParser;