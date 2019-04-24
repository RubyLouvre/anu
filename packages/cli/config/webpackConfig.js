const NanachiWebpackPlugin = require('../nanachi-loader/plugin');
const path = require('path');
const cwd = process.cwd();

module.exports = function({
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
        entry: './source/app',
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
                    exclude: /node_modules[\\\/](?!schnee-ui[\\\/])|React/,
                },
                {
                    test: /node_modules[\\\/](?!schnee-ui[\\\/])/,
                    use: [
                        require.resolve('../nanachi-loader/loaders/fileLoader'),
                        ...postLoaders,
                        require.resolve('../nanachi-loader/loaders/nodeLoader'),
                    ]
                },
                {
                    test: /React/,
                    use: [
                        require.resolve('../nanachi-loader/loaders/fileLoader'),
                        ...postLoaders,
                        require.resolve('../nanachi-loader/loaders/nodeLoader'),
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
            ...plugins
        ],
        resolve: {
            alias: aliasMap,
            mainFields: ['main']
        }
    };
};
