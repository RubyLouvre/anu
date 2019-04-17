const NanachiWebpackPlugin = require('../nanachi-loader/plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const path = require('path');
const cwd = process.cwd();

module.exports = function({
    entry,
    platform,
    compress,
    plugins,
    rules,
    preLoaders, // 自定义预处理loaders
    postLoaders // 自定义后处理loaders
}) {
    let aliasMap = require('../consts/alias')(platform);
    // aliasMap 解析成绝对路径
    Object.keys(aliasMap).forEach(alias => {
        aliasMap[alias] = path.resolve(cwd, aliasMap[alias]);
    });
    const distPath = path.resolve(cwd, platform === 'quick' ? './src' : './dist');
    return {
        entry,
        mode: 'development',
        output: {
            path: distPath,
            filename: 'index.bundle.js'
        },
        module: {
            rules: [
                {
                    test: /\.jsx?$/,
                    use: [
                        require.resolve('../nanachi-loader/loaders/fileLoader'),
                        ...postLoaders,
                        require.resolve('../nanachi-loader/loaders/nanachiLoader'),
                        ...preLoaders
                    ],
                    exclude: /node_modules\/(?!schnee-ui\/)|React/,
                },
                {
                    test: /node_modules\/(?!schnee-ui\/)/,
                    use: [
                        require.resolve('../nanachi-loader/loaders/nodeFileLoader'),
                    ]
                },
                {
                    test: /React/,
                    use: [
                        require.resolve('../nanachi-loader/loaders/nodeFileLoader'),
                        require.resolve('../nanachi-loader/loaders/reactLoader'),
                    ]
                },
                {
                    test: /\.(s[ca]ss|less|css)$/,
                    use: [
                        require.resolve('../nanachi-loader/loaders/fileLoader'),
                        ...postLoaders,
                        require.resolve('../nanachi-loader/loaders/nanachiStyleLoader'),
                        ...preLoaders
                    ]
                },
                ...rules
            ]
        },
        plugins: [
            new NanachiWebpackPlugin({
                platform,
                compress
            }),
            new CleanWebpackPlugin(),
            ...plugins
        ],
        resolve: {
            alias: aliasMap
        }
    };
};
