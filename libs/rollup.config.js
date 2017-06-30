import babel from "rollup-plugin-babel";

//import license from "rollup-plugin-license";


const now = new Date();
export default {
  entry: "./react-tap-event-plugin.js",
  format: "umd",
  exports: "default",
  dest: "./injectTapEventPlugin.js",
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

   // license({
   //   banner: `触屏事件插件 by 司徒正美 Copyright ${JSON.stringify(new Date()).slice(1, -1)}`
   // })
  ],
  moduleName: "injectTapEventPlugin",
  useStrict: false
};
