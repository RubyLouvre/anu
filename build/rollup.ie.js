import babel from "rollup-plugin-babel";
import replace from "rollup-plugin-re";
import filesize from 'rollup-plugin-filesize';

const license = require("rollup-plugin-license");
const json = require("../package.json");
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
      banner: `兼容IE6-8的版本，有问题请加QQ 370262116 by 司徒正美 Copyright ${JSON.stringify(
        new Date()
      ).replace(/T.*|"/g,'')}`
    }),

    replace({
      patterns: [
        {
          test: "VERSION",
          replace: json.version
        }
        
      ]
    }),
    filesize()
  ],
  moduleName: "React",
  useStrict: false
};
