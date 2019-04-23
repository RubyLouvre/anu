const WxParser = require('./WxParser');
const QqParser = require('./QqParser');
const AliParser = require('./AliParser');
const BuParser = require('./BuParser');
const TtParser = require('./TtParser');
const QuickParser = require('./QuickParser');

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
            case 'qq':
                return new QqParser({
                    platform,
                    code,
                    map,
                    meta,
                    filepath
                });
            case 'ali':
                return new AliParser({
                    platform,
                    code,
                    map,
                    meta,
                    filepath
                });
            case 'bu':
                return new BuParser({
                    platform,
                    code,
                    map,
                    meta,
                    filepath
                });
            case 'tt':
                return new TtParser({
                    platform,
                    code,
                    map,
                    meta,
                    filepath
                });
            case 'quick':
                return new QuickParser({
                    platform,
                    code,
                    map,
                    meta,
                    filepath
                });
        }
        
    }
}

module.exports = JavascriptParserFactory;