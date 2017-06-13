import babel from "rollup-plugin-babel";
import replace from "rollup-plugin-re";

const license = require("rollup-plugin-license");

var json = require("./package.json");

const now = new Date();
export default {
  entry: "./src/React.js",
  format: "umd",
  exports: "default",
  dest: "./dist/React.js",
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
      banner: `by 司徒正美 Copyright ${JSON.stringify(new Date()).slice(1, -1)}`
    }),

     replace({
      // ... do replace before commonjs
      patterns: [
        {
          test: 'VERSION', 
          // string or function to replaced with
          replace: json.version,
        },
     
      ]
    })
  ],
  moduleName: "React",
  useStrict: false
};
