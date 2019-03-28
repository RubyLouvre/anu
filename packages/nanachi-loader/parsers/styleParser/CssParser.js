const StyleParser = require('./StyleParser');

class CssParser extends StyleParser {
    parse() {
        return {
            css: this.code
        };
    }
}

module.exports = CssParser;