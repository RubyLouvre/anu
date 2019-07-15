export interface parserMap {
    [platName: string]: any;
}
export interface parserOptions {
    code: string;
    map: any;
    meta: any;
    filepath: string;
    platform: string;
}
declare class JavascriptParserFactory {
    static create(options: parserOptions): any;
}
export default JavascriptParserFactory;
