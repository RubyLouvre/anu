import * as babel from '@babel/core';
import { parserOptions } from './JavascriptParserFactory';
import { NanachiQueue } from '../../nanachi-loader/loaders/nanachiLoader';
export interface BabelRes extends babel.BabelFileResult {
    options?: {
        anu?: any;
    };
}
declare class JavascriptParser {
    map: any;
    meta: any;
    ast: any;
    filepath: string;
    code: string;
    parsedCode: string;
    platform: string;
    componentType: string;
    relativePath: string;
    queues: Array<NanachiQueue>;
    extraModules: Array<string>;
    filterCommonFile: Array<any>;
    protected _babelPlugin: babel.TransformOptions;
    constructor({ code, map, meta, filepath, platform }: parserOptions);
    setComponentType(): void;
    parse(): Promise<BabelRes>;
    getCodeForWebpack(): string;
    getExtraFiles(): NanachiQueue[];
    getExportCode(): string;
}
export default JavascriptParser;
