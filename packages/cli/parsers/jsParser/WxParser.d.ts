import JavascriptParser from './JavascriptParser';
import { parserOptions } from './JavascriptParserFactory';
declare class WxParser extends JavascriptParser {
    constructor(props: parserOptions);
    parse(): Promise<void>;
}
export default WxParser;
