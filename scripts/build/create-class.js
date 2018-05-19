import babel from "rollup-plugin-babel";
import replace from "rollup-plugin-re";
import filesize from "rollup-plugin-filesize";
import cleanup from "rollup-plugin-cleanup";

const license = require("rollup-plugin-license");
const json = require("../../package.json");
//const importAlias = require('rollup-plugin-import-alias');

export default {
    entry: "./packages/core/createClass.js",
    format: "umd",
    exports: "default",
    dest: "./lib/createClass.js",
    plugins: [

        babel(),

        license({
            banner: `React.createClass补丁 by 司徒正美 Copyright ${JSON.stringify(new Date()).replace(/T.*|"/g,"")}
      IE9+
      `
        }),
        cleanup(),
        replace({
            // ... do replace before commonjs
            patterns: [
                {
                    test: "VERSION", 
                    // string or function to replaced with
                    replace: json.version
                }
            ]
        }),
        filesize()
    ],
    moduleName: "createReactClass",
    useStrict: false
};
