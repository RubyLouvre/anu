import StyleParser from './StyleParser';
import { StyleParserOptions } from './StyleParserFactory';
declare class LessParser extends StyleParser {
    constructor(props: StyleParserOptions);
}
export default LessParser;
