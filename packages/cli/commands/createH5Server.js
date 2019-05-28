const webpackDevServer = require('webpack-dev-server');
const webpackH5Config = require('../config/h5/webpack.config.js');
let app;
const PORT = 9090;

module.exports = function(compiler) {
    if (!app) {
        app = new webpackDevServer(compiler, {
            publicPath: webpackH5Config.output.publicPath,
            host: '0.0.0.0',
            port: PORT,
            historyApiFallback: true,
            // noInfo: true,
            hot: true,
            stats: 'errors-only',
            overlay: true,
            watchOptions: {
                poll: 500
            }
        });
        app.listen(PORT);
    }
};