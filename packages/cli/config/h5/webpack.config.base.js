const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');
const path = require('path');
const R = require('ramda');

const {
    intermediateDirectoryName,
    outputDirectory,
    retrieveNanachiConfig
} = require('./configurations');

const context = path.resolve(__dirname, '../../packages/h5Helpers/pageWrapper');
const resolveFromContext = R.curryN(2, path.resolve)(context);
const resolveFromDirCwd = R.curryN(2, path.resolve)(process.cwd());

module.exports = {
    mode: 'development',
    context,
    target: 'web',
    entry: ['webpack-dev-server/client?http://localhost:9091', resolveFromContext('src/index.js')],
    output: {
        path: resolveFromContext(outputDirectory),
        filename: 'bundle.[hash:10].js',
        publicPath: '/'
    },
    resolve: {
        alias: {
            ...retrieveNanachiConfig(),
            react: resolveFromDirCwd('src/library/React.js'),
            '@react': resolveFromContext('src/library/React.js'),
            'react-dom': resolveFromContext('src/library/React.js'),
            'schnee-ui': resolveFromContext(`${intermediateDirectoryName}/schnee-ui`),
            '@shared': resolveFromContext('./src/shared'),
            '@internalComponents': resolveFromContext('src/views/InternalComponents'),
            '@components': resolveFromContext(
                `${intermediateDirectoryName}/components`
            ),
            '@app': resolveFromContext(`${intermediateDirectoryName}/app.js`),
            '@qunar-default-loading': resolveFromContext('src/views/Loading'),
            '@dynamic-page-loader': resolveFromContext(
                'src/views/Page/DynamicPageLoader.js'
            )
        },
        modules: ['node_modules', resolveFromDirCwd('node_modules')]
    },
    module: {
        rules: [
            {
                test: /\.s?[ac]ss$/,
                use: [
                    'style-loader',
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'postcss-sass-loader'
                ]
            },
            {
                test: /\.less$/,
                use: [
                    'style-loader',
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'postcss-less-loader'
                ]
            },
            {
                test: /\.(jpg|png|gif)$/,
                loader: 'file-loader',
                options: {
                    outputPath: 'assets',
                    name: '[name].[hash:10].[ext]'
                }
            }
        ]
    },
    devtool: 'cheap-source-map',
    plugins: [
        new HtmlWebpackPlugin({
            template: resolveFromContext('./src/index.html')
        }),
        new MiniCssExtractPlugin({
            filename: '[name].[hash:10].css',
            chunkFilename: '[id].[hash:10].css'
        }),
        new webpack.EnvironmentPlugin({
            ANU_ENV: 'web'
        })
    ],
    stats: 'errors-only',
    devServer: {
        host: '0.0.0.0',
        port: 9090,
        historyApiFallback: true,
        noInfo: true,
        stats: 'errors-only',
        overlay: true,
        watchOptions: {
            poll: 500
        }
    }
};
