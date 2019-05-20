const webpack = require('webpack');
const webpackDevServer = require('webpack-dev-server');
const webpackH5Config = require('../config/h5/webpack.config.js');


module.exports = function() {
    const compiler = webpack(webpackH5Config);
    const app = new webpackDevServer(compiler, {
        publicPath: webpackH5Config.output.publicPath
    });
    app.listen(3000);
};