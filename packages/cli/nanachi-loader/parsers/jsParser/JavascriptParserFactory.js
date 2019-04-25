const WxParser = require('./WxParser');
const QqParser = require('./QqParser');
const AliParser = require('./AliParser');
const BuParser = require('./BuParser');
const TtParser = require('./TtParser');
const QuickParser = require('./QuickParser');
const map = {
    wx: WxParser,
    qq: QqParser,
    ali: AliParser,
    bu: BuParser,
    tt: TtParser,
    quick: QuickParser
}

class JavascriptParserFactory {
    static create({
        platform,
        code,
        map,
        meta,
        filepath
    }) {
        var parser = map[platform] || Number;
        parser( platform,code, map, meta, filepath) ;
    }
}

module.exports = JavascriptParserFactory;