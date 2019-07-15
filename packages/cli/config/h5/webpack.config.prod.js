const developmentConfig = require('./webpack.config');
const merge = require('webpack-merge');
const env = ['prod', 'rc'];
module.exports = merge(developmentConfig, {
    mode: 'production',
    devtool: env.includes(process.env.NODE_ENV) ? '' : 'cheap-source-map',
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
