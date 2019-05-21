const NanachiWebpackPlugin = require('../nanachi-loader/plugin');
const SizePlugin = require('../nanachi-loader/sizePlugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const path = require('path');
const cwd = process.cwd();
const utils = require('../packages/utils/index');
const { intermediateDirectoryName } = require('./h5/configurations');
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
    analysis,
    prevLoaders, // 自定义预处理loaders
    postLoaders, // 自定义后处理loaders
    // maxAssetSize // 资源大小限制，超出后报warning
}) {
    let aliasMap = require('../consts/alias')(platform);
    // aliasMap 解析成绝对路径
    Object.keys(aliasMap).forEach(alias => {
        aliasMap[alias] = path.resolve(cwd, aliasMap[alias]);
    });
    let distPath = path.resolve(cwd, utils.getDistName(platform));
    if (platform === 'h5') {
        distPath = path.resolve(__dirname, '../packages/h5Helpers/pageWrapper', intermediateDirectoryName);
    }

    let copyPluginOption = null;
    if (compress) {
        const compressImage = require(path.resolve(process.cwd(), 'node_modules', 'nanachi-compress-loader/utils/compressImage.js'));
        copyPluginOption = {
            transform(content, path) {
                const type = path.replace(/.*\.(.*)$/, '$1');
                return compressImage(content, type, compressOption);
            },
            cache: true,
        };
    }

    const nodeRules = [{
        test: /node_modules[\\/](?!schnee-ui[\\/])/,
        use: [].concat(
            fileLoader, 
            postLoaders, 
            aliasLoader, 
            nodeLoader) 
    }];

    const mergeRule = [].concat(
        {
            test: /\.jsx?$/,
            //loader是从后往前处理
            use: [].concat(
                fileLoader, 
                postLoaders, 
                platform !== 'h5' ? aliasLoader: [], 
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
        platform !== 'h5' ? nodeRules : [],
        {
            test: /React\w+/,
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
                platform !== 'h5' ? aliasLoader : [], 
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
            analysis ? new SizePlugin() : [],
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
            new CleanWebpackPlugin(),
            plugins),
        resolve: {
            alias: aliasMap,
            mainFields: ['main']
        },
        externals: {
            'react-loadable': 'Loadable',
            '@qunar-default-loading': 'QunarDefaultLoading',
            '@dynamic-page-loader': 'DynamicPageLoader'
        }
        // performance: {
        //     hints: 'warning',
        //     assetFilter(filename) {
        //         return !/React\w+\.js/.test(filename);
        //     },
        //     maxAssetSize
        // }
    };
};
