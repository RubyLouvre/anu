import babel from "rollup-plugin-babel";
import replace from "rollup-plugin-re";

const license = require("rollup-plugin-license");

var json = require("./package.json");

const now = new Date();
export default {
  entry: "./src/ReactIE.js",
  format: "umd",
  exports: "default",
  dest: "./dist/ReactIE.js",
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
      banner: `兼容IE6-8的版本，有问题请加QQ 453286795 by 司徒正美 Copyright ${JSON.stringify(
        new Date()
      ).slice(1, -1)}`
    }),

    replace({
      patterns: [
        {
          test: "VERSION",
          replace: json.version
        }
      ]
    })
  ],
  moduleName: "React",
  useStrict: false
};
