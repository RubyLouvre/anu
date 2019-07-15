import webpack = require("webpack");
declare class SizePlugin {
    apply(compiler: webpack.Compiler): void;
}
export default SizePlugin;
