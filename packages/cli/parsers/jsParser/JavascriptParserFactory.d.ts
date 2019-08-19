import WxParser from './WxParser';
import QuickParser from './QuickParser';
import H5Parser from './H5Parser';
export interface parserOptions {
    code: string;
    map: any;
    meta: any;
    filepath: string;
    platform: string;
}
declare class JavascriptParserFactory {
    static create(options: parserOptions): H5Parser | WxParser | QuickParser;
}
export default JavascriptParserFactory;
