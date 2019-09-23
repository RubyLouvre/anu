import WxParser from './WxParser';
import QqParser from './QqParser';
import AliParser from './AliParser';
import BuParser from './BuParser';
import TtParser from './TtParser';
import QuickParser from './QuickParser';
import H5Parser from './H5Parser';

export interface parserOptions {
    code: string;
    map: any;
    meta: any;
    filepath: string;
    platform: string;
}

class JavascriptParserFactory {
    static create(options: parserOptions) {
        const { platform } = options
        switch (platform) {
            case 'wx':
                return new WxParser(options);
            case 'qq':
                return new QqParser(options);
            case 'ali':
                return new AliParser(options);
            case 'bu':
                return new BuParser(options);
            case 'tt':
                return new TtParser(options);
            case 'quick':
                return new QuickParser(options);
            case 'h5':
                return new H5Parser(options);
            case '360':
                return new H5Parser(options);
            default:
                return new WxParser(options);
        }
    }
}

export default JavascriptParserFactory;
module.exports = JavascriptParserFactory;