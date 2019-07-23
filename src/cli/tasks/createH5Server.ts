import webpackDevServer from 'webpack-dev-server';
import webpack = require('webpack');
import getPort from 'get-port';
import webpackH5Config from '../config/h5/webpack.config';
let app: webpackDevServer;
const PORT = 8080;

export default async function(compiler: webpack.Compiler) {
    if (!app) {
        const port = await getPort({
            port: PORT
        });
        app = new webpackDevServer(compiler, {
            publicPath: webpackH5Config.output.publicPath,
            host: '0.0.0.0',
            port,
            historyApiFallback: {
                rewrites: [{
                    from: /.*/g,
                    to: '/web/'
                }]
            },
            disableHostCheck: true,
            // noInfo: true,
            // https: true, // TODO做成配置项
            hot: true,
            stats: 'errors-only',
            overlay: true,
            watchOptions: {
                poll: 500
            }
        });
        app.listen(port);
    }
};