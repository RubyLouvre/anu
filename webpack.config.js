const webpack = require("webpack");
const path = require("path");
const fs = require("fs");
var es3ifyPlugin = require('es3ify-webpack-plugin');

module.exports = {
  context: __dirname,
  entry: {
    index9: "./src/index9.js"
  },
  output: {
    path: __dirname + "/dist/",
    filename: "[name].js"
  },
  plugins: [new es3ifyPlugin()],
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: "babel-loader",
        exclude: path.resolve(__dirname, "node_modules")
      }
    ]
  },

  resolve: {
    //如果不使用anu，就可以把这里注释掉
    alias: {
      react: "anujs/dist/ReactIE.js",
      "react-dom": "anujs/dist/ReactIE.js"
    }
  }
};