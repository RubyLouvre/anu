const StyleParser = require('./StyleParser');

class CssParser extends StyleParser {
    parse() {
        this.parsedCode = this.code;
    }
}

module.exports = CssParser;