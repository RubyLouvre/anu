import babel from "rollup-plugin-babel";
import cleanup from 'rollup-plugin-cleanup';
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
    }),cleanup()],
    moduleName: "ReactDOMServer",
    useStrict: false
};