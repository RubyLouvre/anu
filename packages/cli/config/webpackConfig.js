const NanachiWebpackPlugin = require('../nanachi-loader/plugin');
const path = require('path');
const cwd = process.cwd();

module.exports = function({
    entry,
    platform,
    compress,
    plugins
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
            // noParse: /React/,
            rules: [
                {
                    test: /\.jsx?$/,
                    use: [
                        require.resolve('../nanachi-loader/loaders/fileLoader'),
                        require.resolve('../nanachi-loader/loaders/nanachiLoader'),
                    ],
                    exclude: /node_modules\/(?!schnee-ui\/)|React/,
                },
                {
                    test: /node_modules\/(?!schnee-ui\/)|React/,
                    use: [
                        require.resolve('../nanachi-loader/loaders/nodeFileLoader'),
                    ]
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
            new NanachiWebpackPlugin({
                platform,
                compress
            })
        ].concat(plugins),
        resolve: {
            alias: aliasMap
        }
    };
};
