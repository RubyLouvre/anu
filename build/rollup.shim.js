import babel from "rollup-plugin-babel";
import replace from "rollup-plugin-re";
import filesize from "rollup-plugin-filesize";
import cleanup from 'rollup-plugin-cleanup';

const license = require("rollup-plugin-license");
const json = require("../package.json");

export default {
    entry: "./src/ReactShim.js",
    format: "umd",
    exports: "default",
    dest: "./dist/ReactShim.js",
    plugins: [
        babel({
            //  plugins: ['external-helpers'],
            // externalHelpers: true,
            babelrc: false,
            presets: [
                [
                    "env",
                    {
                        modules: false
                    }
                ]
            ]
        }),
        cleanup(),
        license({
            banner: `此版本要求浏览器没有createClass, createFactory, PropTypes, isValidElement,
        unmountComponentAtNode,unstable_renderSubtreeIntoContainer
        QQ 370262116 by 司徒正美 Copyright ${JSON.stringify(
        new Date()
    ).replace(/T.*|"/g, "")}`
        }),

        replace({
            patterns: [
                {
                    test: "VERSION",
                    replace: json.version
                },
                {
                    test: "el.attachEvent(\"on\" + type, fn);",
                    replace: ""
                }
            ]
        }),
        filesize()
    ],
    moduleName: "React",
    useStrict: false
};
