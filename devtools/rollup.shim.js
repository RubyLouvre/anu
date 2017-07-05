import babel from "rollup-plugin-babel";
import replace from "rollup-plugin-re";

const license = require("rollup-plugin-license");
const json = require("../package.json");
const now = new Date();

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
          "es2015",
          {
            modules: false
          }
        ]
      ]
    }),

    license({
      banner: `此版本没有isValidElement, PropTypes, QQ 453286795 by 司徒正美 Copyright ${JSON.stringify(
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
          test: 'el.attachEvent("on" + type, fn);',
          replace: ''
        }
      ]
    })
  ],
  moduleName: "React",
  useStrict: false
};
