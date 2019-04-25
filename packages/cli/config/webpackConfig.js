const NanachiWebpackPlugin = require('../nanachi-loader/plugin');
const path = require('path');
const cwd = process.cwd();
//各种loader
//生成文件
const fileLoader = require.resolve('../nanachi-loader/loaders/fileLoader');
//处理@component, @comom
const aliasLoader = require.resolve('../nanachi-loader/loaders/aliasLoader');
//visitor
const nanachiLoader = require.resolve('../nanachi-loader/loaders/nanachiLoader');
//将第三方依赖库复制到npm目录中
const nodeLoader = require.resolve('../nanachi-loader/loaders/nodeLoader');
 //处理华为快应用
const reactLoader = require.resolve('../nanachi-loader/loaders/reactLoader');

module.exports = function({
    platform,
    compress,
    plugins,
    rules,
    prevLoaders, // 自定义预处理loaders
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
            rules: [].concat(
                {
                    test: /\.jsx?$/,
                    //loader是从后往前处理
                    use: [].concat(
                        fileLoader, 
                        postLoaders, 
                        aliasLoader, 
                        nanachiLoader, 
                        prevLoaders ) ,
                    exclude: /node_modules[\\\/](?!schnee-ui[\\\/])|React/,
                },
                {
                    test: /node_modules[\\\/](?!schnee-ui[\\\/])/,
                    use: [].concat(
                        fileLoader, 
                        postLoaders, 
                        aliasLoader, 
                        nodeLoaders) 
                },
                {
                    test: /React/,
                    use: [].concat(
                        fileLoader, 
                        postLoaders,
                        nodeLoader, 
                        reactLoader),
                },
                {
                    test: /\.(s[ca]ss|less|css)$/,
                    use: [].concat(
                        fileLoader, 
                        postLoaders, 
                        aliasLoader, 
                        nanachiStyleLoader, 
                        prevLoaders)
                },
                rules)
        },
        plugins: [].concat( 
            new NanachiWebpackPlugin({
                platform,
                compress
            }),
            plugins),
        resolve: {
            alias: aliasMap,
            mainFields: ['main']
        }
    };
};
