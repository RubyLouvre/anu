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

const context = path.resolve(process.cwd(), 'dist');
const h5helperPath = path.resolve(__dirname, '../../packages/h5Helpers');
const resolveFromContext = R.curryN(2, path.resolve)(context);
const resolveFromDirCwd = R.curryN(2, path.resolve)(process.cwd());
const resolveFromH5Helper = R.curryN(2, path.resolve)(h5helperPath);

module.exports = {
    mode: 'development',
    context,
    target: 'web',
    entry: resolveFromContext(`${intermediateDirectoryName}/app.js`),
    output: {
        path: resolveFromDirCwd(outputDirectory),
        filename: 'bundle.[hash:10].js',
        publicPath: '/'
    },
    resolve: {
        alias: {
            ...retrieveNanachiConfig(),
            react: path.resolve(__dirname, '../../lib/ReactH5.js'),
            '@react': path.resolve(__dirname, '../../lib/ReactH5.js'),
            'react-dom': path.resolve(__dirname, '../../lib/ReactH5.js'),
            'schnee-ui': resolveFromContext(`${intermediateDirectoryName}/npm/schnee-ui`),
            '@shared': resolveFromContext('./src/shared'),
            '@internalComponents': resolveFromH5Helper('components'),
            '@internalConsts': path.resolve(__dirname, '../../consts/'),
            '@components': resolveFromContext(
                `${intermediateDirectoryName}/components`
            ),
            // '@app': resolveFromContext(`${intermediateDirectoryName}/app.js`),
            '@qunar-default-loading': resolveFromH5Helper('components/Loading'),
            // '@dynamic-page-loader': resolveFromContext(
            //     'src/views/Page/DynamicPageLoader.js'
            // )
        },
        modules: ['node_modules', resolveFromDirCwd('node_modules')]
    },
    module: {
        rules: [
            {
                test: /\.s?[ac]ss$/,
                use: [
                    require.resolve('style-loader'),
                    MiniCssExtractPlugin.loader,
                    require.resolve('css-loader'),
                    {
                        loader: require.resolve('postcss-sass-loader'),
                        options: {
                            plugin: []
                        }
                    }
                ]
            },
            {
                test: /\.less$/,
                use: [
                    require.resolve('style-loader'),
                    MiniCssExtractPlugin.loader,
                    require.resolve('css-loader'),
                    {
                        loader: require.resolve('postcss-less-loader'),
                        options: {
                            plugin: []
                        }
                    }
                ]
            },
            {
                test: /\.(jpg|png|gif)$/,
                loader: require.resolve('file-loader'),
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
            template: resolveFromH5Helper('./index.html')
        }),
        new MiniCssExtractPlugin({
            filename: '[name].[hash:10].css',
            chunkFilename: '[id].[hash:10].css'
        }),
        new webpack.EnvironmentPlugin({
            ANU_ENV: 'web'
        }),
        // new CleanWebpackPlugin()
    ],
    stats: 'errors-only'
};
