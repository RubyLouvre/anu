const SassParser = require('./SassParser');
const LessParser = require('./LessParser');
const CssParser = require('./CssParser');

class StyleParserFactory {
    static create({
        type,
        platform,
        code,
        map,
        meta,
        filepath
    }) {
        switch (type) {
            case 'sass':
            case 'scss':
                return SassParser.getParser({
                    platform,
                    code,
                    map,
                    meta,
                    filepath
                });
            case 'css':
                return CssParser.getParser({
                    platform,
                    code,
                    map,
                    meta,
                    filepath
                });
            case 'less':
                return LessParser.getParser({
                    platform,
                    code,
                    map,
                    meta,
                    filepath
                });
        }
    }
}

module.exports = StyleParserFactory;