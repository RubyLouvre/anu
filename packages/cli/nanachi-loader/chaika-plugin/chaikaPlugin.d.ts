import webpack = require("webpack");
declare class ChaikaPlugin {
    apply(compiler: webpack.Compiler): void;
}
export default ChaikaPlugin;
