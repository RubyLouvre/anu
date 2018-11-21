import babel from "rollup-plugin-babel";
import replace from "rollup-plugin-re";
import filesize from "rollup-plugin-filesize";
import cleanup from "rollup-plugin-cleanup";

const license = require("rollup-plugin-license");
const json = require("../../package.json");

export default {
    input: "./packages/store/index.js",
    
    output: {
        strict: false,
        format: "umd",
        legacy: true,
        // exports: "default",
        file:  "./dist/Rematch.js",
        name: "Rematch",
        globals: {
            redux: "Redux",
        }
    },
    external: ["redux"],
    
    plugins: [

        babel(),

        license({
            banner: "Rematch的anujs适配版 文档见这里 https://rematch.gitbooks.io/rematch"
        }),
        cleanup(),
        replace({
            // ... do replace before commonjs //process.env.NODE_ENV
            patterns: [
                {
                    test: "VERSION", 
                    // string or function to replaced with
                    replace: json.version
                },
                {
                    test: /process\.env\.NODE_ENV/g, 
                    // string or function to replaced with
                    replace: JSON.stringify("production")
                }
            ]
        }),
        filesize()
    ],
   
};
