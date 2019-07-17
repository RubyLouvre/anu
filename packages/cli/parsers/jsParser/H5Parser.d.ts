import JavascriptParser from './JavascriptParser';
import { parserOptions } from './JavascriptParserFactory';
declare class H5Parser extends JavascriptParser {
    constructor(props: parserOptions);
    parse(): Promise<import("./JavascriptParser").BabelRes>;
}
export default H5Parser;
