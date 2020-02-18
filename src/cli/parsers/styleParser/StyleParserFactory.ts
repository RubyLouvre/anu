import webpack = require("webpack");

import SassParser from './SassParser';
import LessParser from './LessParser';
import CssParser from './CssParser';

export interface StyleParserOptions {
    type: string;
    code: string;
    map: any;
    meta: any;
    filepath: string;
    platform: string;
    loaderContext: webpack.loader.LoaderContext
}

class StyleParserFactory {
    static create({
        type,
        ...options
    }: StyleParserOptions) {
        switch (type) {
            case 'sass':
            case 'scss':
                return new SassParser({
                    type: 'sass',
                    ...options
                });
            case 'css':
                return new CssParser({
                    type,
                    ...options
                });
            case 'less':
                return new LessParser({
                    type,
                    ...options
                });
        }
    }
}
module.exports = StyleParserFactory;
export default StyleParserFactory;
