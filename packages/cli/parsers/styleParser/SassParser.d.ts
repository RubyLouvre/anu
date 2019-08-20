import StyleParser from './StyleParser';
import { StyleParserOptions } from './StyleParserFactory';
declare class SassParser extends StyleParser {
    constructor(props: StyleParserOptions);
}
export default SassParser;
