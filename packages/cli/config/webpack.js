const path = require('path');
const cwd = process.cwd();
const distPath = path.resolve(cwd, './dist');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const NanachiWebpackPlugin = require('../../nanachi-loader/plugin');

module.exports = {
    mode: 'development',
    context: cwd,
    entry: './source/app.js',
    output: {
        path: distPath,
        filename: 'index.bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                use: [
                    require.resolve('../../nanachi-loader/loaders/fileLoader'),
                    require.resolve('../../nanachi-loader')
                    
                ],
                exclude: /node_modules/
            },
            {
                test: /\.s[ca]ss$/,
                use: [
                    require.resolve('style-loader'),
                    require.resolve('css-loader'),
                    require.resolve('../../nanachi-loader/loaders/fileLoader'),
                    require.resolve('../../nanachi-loader/loaders/nanachiStyleLoader'),
                ]
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns: [distPath]
        }),
        new NanachiWebpackPlugin()
    ]
};
