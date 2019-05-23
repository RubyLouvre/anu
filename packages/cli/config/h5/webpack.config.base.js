const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
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
    entry: resolveFromContext('src/index.js'),
    output: {
        path: resolveFromDirCwd(outputDirectory),
        filename: 'bundle.[hash:10].js',
        publicPath: '/'
    },
    resolve: {
        alias: {
            ...retrieveNanachiConfig(),
            react: resolveFromContext(`${intermediateDirectoryName}/ReactH5.js`),
            '@react': resolveFromContext(`${intermediateDirectoryName}/ReactH5.js`),
            'react-dom': resolveFromContext(`${intermediateDirectoryName}/ReactH5.js`),
            'schnee-ui': resolveFromContext(`${intermediateDirectoryName}/npm/schnee-ui`),
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
                    {
                        loader: 'postcss-sass-loader',
                        options: {
                            plugin: []
                        }
                    }
                ]
            },
            {
                test: /\.less$/,
                use: [
                    'style-loader',
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    {
                        loader: 'postcss-less-loader',
                        options: {
                            plugin: []
                        }
                    }
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
        }),
        new CleanWebpackPlugin()
    ],
    stats: 'errors-only'
};
