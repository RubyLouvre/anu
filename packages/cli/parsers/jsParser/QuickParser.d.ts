import JavascriptParser from './JavascriptParser';
import { parserOptions } from './JavascriptParserFactory';
declare class QuickParser extends JavascriptParser {
    constructor(props: parserOptions);
    parse(): Promise<import("./JavascriptParser").BabelRes>;
    getUxCode(): string;
}
export default QuickParser;
