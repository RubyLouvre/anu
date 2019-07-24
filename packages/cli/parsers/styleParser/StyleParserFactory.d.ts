import webpack = require("webpack");
import SassParser from './SassParser';
import LessParser from './LessParser';
export interface StyleParserOptions {
    type: string;
    code: string;
    map: any;
    meta: any;
    filepath: string;
    platform: string;
    loaderContext: webpack.loader.LoaderContext;
}
declare class StyleParserFactory {
    static create({ type, ...options }: StyleParserOptions): SassParser | LessParser;
}
export default StyleParserFactory;
