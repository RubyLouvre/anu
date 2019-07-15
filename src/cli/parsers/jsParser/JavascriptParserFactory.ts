import WxParser from './WxParser';
import QqParser from './QqParser';
import AliParser from './AliParser';
import BuParser from './BuParser';
import TtParser from './TtParser';
import QuickParser from './QuickParser';
import H5Parser from './H5Parser';

export interface parserMap {
    [platName: string]: any
}

export interface parserOptions {
    code: string;
    map: any;
    meta: any;
    filepath: string;
    platform: string;
}

const maps: parserMap = {
    wx: WxParser,
    qq: QqParser,
    ali: AliParser,
    bu: BuParser,
    tt: TtParser,
    quick: QuickParser,
    h5: H5Parser
}

class JavascriptParserFactory {
    static create(options: parserOptions) {
        const { platform } = options
        const Parser = maps[platform];
        return new Parser(options);
    }
}

export default JavascriptParserFactory;
module.exports = JavascriptParserFactory;