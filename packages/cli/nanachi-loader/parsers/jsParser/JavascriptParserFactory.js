const WxParser = require('./WxParser');
const QqParser = require('./QqParser');
const AliParser = require('./AliParser');
const BuParser = require('./BuParser');
const TtParser = require('./TtParser');
const QuickParser = require('./QuickParser');
const maps = {
    wx: WxParser,
    qq: QqParser,
    ali: AliParser,
    bu: BuParser,
    tt: TtParser,
    quick: QuickParser
}
class JavascriptParserFactory {
    static create({
        platform
    }) {
        var parser = maps[platform] || Number;
        return new parser( arguments[0] );
    }
}

module.exports = JavascriptParserFactory;