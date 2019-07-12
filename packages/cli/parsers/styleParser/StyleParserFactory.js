const SassParser = require('./SassParser');
const LessParser = require('./LessParser');
const CssParser = require('./CssParser');

class StyleParserFactory {
    static create({
        type,
        ...options
    }) {
        switch (type) {
            case 'sass':
            case 'scss':
                return new SassParser({
                    type: 'sass',
                    ...options
                });
            case 'css':
                return new CssParser({
                    type,
                    ...options
                });
            case 'less':
                return new LessParser({
                    type,
                    ...options
                });
        }
    }
}

module.exports = StyleParserFactory;