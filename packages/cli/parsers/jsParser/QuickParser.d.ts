import JavascriptParser from './JavascriptParser';
import { parserOptions } from './JavascriptParserFactory';
declare class QuickParser extends JavascriptParser {
    constructor(props: parserOptions);
    parse(): Promise<void>;
    getUxCode(): string;
}
export default QuickParser;
