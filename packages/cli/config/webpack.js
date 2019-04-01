const path = require('path');
const cwd = process.cwd();
const distPath = path.resolve(cwd, './dist');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const NanachiWebpackPlugin = require('../nanachi-loader/plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    mode: 'development',
    context: cwd,
    entry: './source/app.js',
    output: {
        path: distPath,
        filename: 'index.bundle.js'
    },
    module: {
        noParse: /node_modules/,
        rules: [
            {
                test: /\.jsx?$/,
                use: [
                    require.resolve('../nanachi-loader/loaders/fileLoader'),
                    require.resolve('../nanachi-loader'),
                ],
                exclude: /node_modules/
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
            {
                from: path.resolve(cwd, 'source/assets'),
                to: path.resolve(cwd, 'dist/assets')
            }
        ]),
        new NanachiWebpackPlugin()
    ],
    // resolve: {
    //     alias: {
    //         'react': path.resolve(cwd, 'source', REACT_LIB_MAP[buildType]),
    //         '@react': path.resolve(cwd, 'source', REACT_LIB_MAP[buildType]),
    //         '@components': path.resolve(cwd, 'source/components')
    //     }
    // }
};
