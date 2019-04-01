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
                return new SassParser({
                    code,
                    map,
                    meta,
                    filepath,
                    platform
                });
            case 'css':
                return new CssParser({
                    code,
                    map,
                    meta,
                    filepath,
                    platform
                });
            case 'less':
                return new LessParser({
                    code,
                    map,
                    meta,
                    filepath,
                    platform
                });
        }
    }
}

module.exports = StyleParserFactory;