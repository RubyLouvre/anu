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
    static create(options: parserOptions): QuickParser | WxParser | H5Parser;
}
export default JavascriptParserFactory;
