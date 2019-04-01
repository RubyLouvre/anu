const path = require('path');
const postcss = require('postcss');

class StyleParser {
    constructor({
        code,
        map,
        meta,
        filepath,
        platform,
        type
    }) {
        this.code = code;
        this.map = map;
        this.meta = meta;
        this.filepath = filepath;
        this.type = type;
        this.platform = platform;
        this.relativePath = path.relative(path.resolve(process.cwd(), 'source'), filepath);
        this._postcssPlugins = [];
        this._postcssOptions = {};
    }
    
    parse() {
        return new Promise((resolve, reject) => {
            postcss(this._postcssPlugins).process(this.code, this._postcssOptions).then((res) => {
                resolve(res);
            }).catch((err) => {
                reject(err);
            });
        });
    }
}

module.exports = StyleParser;