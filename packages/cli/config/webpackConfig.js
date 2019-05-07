const NanachiWebpackPlugin = require('../nanachi-loader/plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');
const cwd = process.cwd();
const utils = require('../packages/utils/index');
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

//处理 style
const nanachiStyleLoader  = require.resolve('../nanachi-loader/loaders/nanachiStyleLoader');

module.exports = function({
    platform,
    compress,
    compressOption,
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

    const copyPluginOption = compress ? {
        transform(content, path) {
            const type = path.replace(/.*\.(.*)$/, '$1');
            return utils.compressImage(content, type, compressOption);
        },
        // cache: true,
    } : null;

    var mergeRule = [].concat(
        {
            test: /\.jsx?$/,
            //loader是从后往前处理
            use: [].concat(
                fileLoader, 
                postLoaders, 
                aliasLoader, 
                nanachiLoader,
                {
                    loader: require.resolve('eslint-loader'),
                    options: {
                        configFile: require.resolve(`./eslint/.eslintrc-${platform}.js`),
                        failOnError: utils.isMportalEnv(),
                        allowInlineConfig: false, // 不允许使用注释配置eslint规则
                        useEslintrc: false // 不使用用户自定义eslintrc配置
                    }
                },
                prevLoaders ) ,
            exclude: /node_modules[\\/](?!schnee-ui[\\/])|React/,
        },
        {
            test: /node_modules[\\/](?!schnee-ui[\\/])/,
            use: [].concat(
                fileLoader, 
                postLoaders, 
                aliasLoader, 
                nodeLoader) 
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
        rules);

    return {
        entry: './source/app',
        mode: 'development',
        output: {
            path: distPath,
            filename: 'index.bundle.js'
        },
        module: {
            rules: mergeRule
        },
        plugins: [].concat( 
            new NanachiWebpackPlugin({
                platform,
                compress
            }),
            new CopyWebpackPlugin([
                {
                    from: '**',
                    to: 'assets',
                    context: 'source/assets',
                    ...copyPluginOption // 压缩图片配置
                }
            ], {
                ignore: [
                    '**/*.@(js|jsx|json|sass|scss|less|css)'
                ]
            }),
            plugins),
        resolve: {
            alias: aliasMap,
            mainFields: ['main']
        }
    };
};
