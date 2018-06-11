import babel from "rollup-plugin-babel";
import replace from "rollup-plugin-re";
import filesize from "rollup-plugin-filesize";
import cleanup from "rollup-plugin-cleanup";

const license = require("rollup-plugin-license");
const json = require("../../package.json");

export default {
    input: "./packages/router/index.jsx",
    
    output: {
        strict: false,
        format: "umd",
        exports: "default",
        file:  "./dist/Router.js",
        name: "ReachRouter",
        globals: {
            react: "React",
            "react-dom": "ReactDOM"
        }
    },
    external: ["react", "react-dom"],
    
    plugins: [

        babel(),

        license({
            banner: "Reach Router的anujs适配版 文档见这里 https://reach.tech/router"
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
                    test: "VERSION", 
                    // string or function to replaced with
                    replace: json.version
                }
            ]
        }),
        filesize()
    ],
    //moduleName: "Router",
   
};
