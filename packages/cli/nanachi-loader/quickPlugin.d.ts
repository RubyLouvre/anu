import webpack = require("webpack");
declare class QuickPlugin {
    apply(compiler: webpack.Compiler): void;
}
export default QuickPlugin;
