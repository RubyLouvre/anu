import babel from "rollup-plugin-babel";
//import builtins from "rollup-plugin-node-builtins";

export default {
    entry: "./server/index.js",
    format: "umd",
    exports: "default",
    dest: "./dist/ReactDOMServer.js",
    plugins: [babel({
        babelrc: false,
        presets: [
            [
                "env",
                {
                    modules: false
                }
            ]
        ]
    })],
    moduleName: "ReactDOMServer",
    useStrict: false
};