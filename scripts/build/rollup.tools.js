import babel from "rollup-plugin-babel";

export default {
    entry: "./build/index.js",
    format: "umd",
    exports: "default",
    dest: "./lib/devtools.js",
    plugins: [babel() ],
    moduleName: "DevTools",
    useStrict: false
};