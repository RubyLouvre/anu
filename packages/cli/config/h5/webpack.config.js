const developmentConfig = require('./webpack.config.base');
const merge = require('webpack-merge');
const path = require('path');

module.exports = merge(developmentConfig, {
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                loader: 'babel-loader',
                options: {
                    exclude: [/node_modules/],
                    cacheDirectory: true,
                    root: path.resolve(__dirname, '../../packages/h5Helpers/pageWrapper'),
                    plugins: [
                        require.resolve('styled-jsx/babel'),
                        require.resolve('@babel/plugin-transform-runtime'),
                        require.resolve('@babel/plugin-syntax-dynamic-import'),
                        require.resolve('@babel/plugin-proposal-object-rest-spread'),
                        [require.resolve('@babel/plugin-proposal-decorators'), { legacy: true }],
                        [require.resolve('@babel/plugin-proposal-class-properties'), { loose: true }]
                    ],
                    presets: [require.resolve('@babel/preset-react')]
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
