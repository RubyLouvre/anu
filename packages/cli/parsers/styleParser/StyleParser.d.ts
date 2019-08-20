import postcss from 'postcss';
import { StyleParserOptions } from './StyleParserFactory';
import webpack = require('webpack');
declare class StyleParser {
    map: any;
    meta: any;
    ast: any;
    filepath: string;
    code: string;
    parsedCode: string;
    platform: string;
    type: string;
    componentType: string;
    relativePath: string;
    extraModules: Array<string>;
    loaderContext: webpack.loader.LoaderContext | {};
    protected _postcssPlugins: Array<any>;
    protected _postcssOptions: postcss.ProcessOptions;
    constructor({ code, map, meta, filepath, platform, type, loaderContext }: StyleParserOptions);
    getRelativePath(filepath: string): string;
    parse(): Promise<postcss.Result>;
    getExtraFiles(): {
        type: string;
        path: string;
        code: string;
    }[];
    getExportCode(): string;
}
export default StyleParser;
