import JavascriptParser, { BabelRes } from './JavascriptParser';
import { parserOptions } from './JavascriptParserFactory';
declare class WxParser extends JavascriptParser {
    constructor(props: parserOptions);
    parse(): Promise<BabelRes>;
}
export default WxParser;
