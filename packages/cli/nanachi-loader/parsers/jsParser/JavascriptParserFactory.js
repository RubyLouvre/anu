const WxParser = require('./WxParser');
// const AliParser = require('./AliParser');
// const BuParser = require('./BuParser');

class JavascriptParserFactory {
    static create({
        platform,
        code,
        map,
        meta,
        filepath
    }) {
        switch (platform) {
            case 'wx':
                return new WxParser({
                    platform,
                    code,
                    map,
                    meta,
                    filepath
                });
            // case 'ali':
            //     return AliParser.getParser({
            //         platform,
            //         code,
            //         map,
            //         meta,
            //         filepath
            //     });
            // case 'bu':
            //     return BuParser.getParser({
            //         platform,
            //         code,
            //         map,
            //         meta,
            //         filepath
            //     });
            // case 'tt':
            //     return TtParser.getParser({
            //         platform,
            //         code,
            //         map,
            //         meta,
            //         filepath
            //     });
            // case 'quick':
            //     return QuickParser.getParser({
            //         platform,
            //         code,
            //         map,
            //         meta,
            //         filepath
            //     });
        }
        
    }
}

module.exports = JavascriptParserFactory;