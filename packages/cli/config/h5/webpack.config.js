const developmentConfig = require('./webpack.config.base');
const merge = require('webpack-merge');

module.exports = merge(developmentConfig, {
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        options: {
          exclude: [/node_modules/],
          include: ['mini-html/src/*'],
          cacheDirectory: true,
          root: __dirname
        }
      }
    ]
  },
  optimization: {
    noEmitOnErrors: true
  },
  performance: {
    hints: false
  }
});
