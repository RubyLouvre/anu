import { NanachiOptions } from '../index';
import webpack = require('webpack');
interface NanachiCompiler extends webpack.Compiler {
    NANACHI?: {
        webviews?: Array<any>;
    };
}
declare class NanachiWebpackPlugin implements webpack.Plugin {
    private timer;
    private nanachiOptions;
    constructor({ platform, compress, beta, betaUi }?: NanachiOptions);
    apply(compiler: NanachiCompiler): void;
}
export default NanachiWebpackPlugin;
