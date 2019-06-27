/**
 * This configuration is designed for legacy environment
 * which has full support of ES5.
 */
const developmentConfig = require('./webpack.config');
const merge = require('webpack-merge');

module.exports = merge(developmentConfig, {
  mode: 'production',
  // module: {
  //   rules: [
  //     {
  //       test: /\.jsx?$/,
  //       loader: 'babel-loader',
  //       options: {
  //         cacheDirectory: true,
  //         babelrc: false,
  //         exclude: [/node_modules/],
  //         include: ['mini-html/src/*'],
  //         plugins: [
  //           'styled-jsx/babel',
  //           '@babel/plugin-transform-runtime',
  //           '@babel/plugin-syntax-dynamic-import',
  //           '@babel/plugin-proposal-object-rest-spread',
  //           ['@babel/plugin-proposal-decorators', { legacy: true }],
  //           ['@babel/plugin-proposal-class-properties', { loose: true }]
  //         ],
  //         presets: [
  //           [
  //             '@babel/preset-env',
  //             {
  //               modules: false,
  //               useBuiltIns: false,
  //               targets: {
  //                 browsers: ['> 1%']
  //               }
  //             }
  //           ],
  //           '@babel/preset-react'
  //         ]
  //       }
  //     }
  //   ]
  // },
  optimization: {
    noEmitOnErrors: true,
    splitChunks: {
      chunks: 'async'
    }
  },
  performance: {
    hints: false
  }
});
