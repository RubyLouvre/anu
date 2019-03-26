const StyleParser = require('./StyleParser');

class CssParser extends StyleParser {
    static getParser({
        code,
        map,
        meta,
        filepath,
        platform
    }) {
        if (!this._instance) {
            this._instance = new CssParser({
                code,
                map,
                meta,
                filepath,
                platform
            });
        }
        return this._instance;
    }
    parse() {
        return {
            css: this.code
        };
    }
}

module.exports = CssParser;