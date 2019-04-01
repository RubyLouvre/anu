const path = require('path');
const cwd = process.cwd();
const CleanWebpackPlugin = require('clean-webpack-plugin');
const NanachiWebpackPlugin = require('../nanachi-loader/plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const config = require('../packages/config.js');
const { REACT_LIB_MAP } = require('../consts/index');
const distPath = path.resolve(cwd, config['buildType'] === 'quick' ? './src' : './dist');

module.exports = {
    mode: 'development',
    context: cwd,
    entry: './source/app.js',
    output: {
        path: distPath,
        filename: 'index.bundle.js'
    },
    module: {
        noParse: /node_modules|React/,
        rules: [
            {
                test: /\.jsx?$/,
                use: [
                    require.resolve('../nanachi-loader/loaders/fileLoader'),
                    require.resolve('../nanachi-loader'),
                ],
                exclude: /node_modules|React/
            },
            {
                test: /\.(s[ca]ss|less|css)$/,
                use: [
                    require.resolve('../nanachi-loader/loaders/fileLoader'),
                    require.resolve('../nanachi-loader/loaders/nanachiStyleLoader'),
                ]
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin({
            // verbose: true, // 是否开启删除log
            // cleanOnceBeforeBuildPatterns: []
        }),
        new CopyWebpackPlugin([
            // copy assets
            {
                from: path.resolve(cwd, 'source/assets'),
                to: path.resolve(cwd, 'dist/assets')
            },
            // copy core react
            {
                from: path.resolve(cwd, 'source', REACT_LIB_MAP[config['buildType']])
            }
        ]),
        new NanachiWebpackPlugin({
            platform: config['buildType']
        })
    ],
    // resolve: {
    //     alias: {
    //         'react': path.resolve(cwd, 'source', REACT_LIB_MAP[buildType]),
    //         '@react': path.resolve(cwd, 'source', REACT_LIB_MAP[buildType]),
    //         '@components': path.resolve(cwd, 'source/components')
    //     }
    // }
};
