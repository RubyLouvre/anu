const webpack = require('webpack');
const path = require('path');
const cwd = process.cwd();
const NanachiWebpackPlugin = require('./nanachi-loader/plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const globalConfig = require('./packages/config.js');
const { REACT_LIB_MAP } = require('./consts/index');
const nanachiBaseConfig = require('./config/nanachiBaseConfig');

function injectBuildEnv({ buildType, compress, huawei } = {}){
    process.env.ANU_ENV = buildType;
    globalConfig['buildType'] = buildType;
    globalConfig['compress'] = compress;
    if (buildType === 'quick') {
        globalConfig['huawei'] = huawei || false;
    }
}

function getUserAlias(){
    const json = require(path.resolve(cwd, './package.json'));
    return json && json.nanachi && json.nanachi.alias || {};
}

function mergeNanachiConfig(nanachiBaseConfig, {
    entry,
    distPath,
    platform,
    compress,
    plugins
}) {
    // 解析别名绝对路径
    const aliasMap = {
        '@react': 'source/' + REACT_LIB_MAP[platform],
        '@components': 'source/components'
    };
    Object.assign(aliasMap, getUserAlias());
    Object.keys(aliasMap).forEach(alias => {
        aliasMap[alias] = path.resolve(cwd, aliasMap[alias]);
    });
    return Object.assign({}, nanachiBaseConfig, {
        entry,
        output: {
            path: distPath,
            filename: 'index.bundle.js'
        },
        plugins: [
            new CopyWebpackPlugin([
                // copy assets
                {
                    from: path.resolve(cwd, 'source/assets'),
                    to: path.resolve(distPath, 'assets')
                },
                // // copy core react
                // {
                //     from: path.resolve(cwd, 'source', REACT_LIB_MAP[platform]),
                //     to: distPath
                // }
            ], {
                copyUnmodified: true
            }),
            new NanachiWebpackPlugin({
                platform,
                compress
            })
        ].concat(plugins),
        resolve: {
            alias: aliasMap
        }
    });
}

async function nanachi({
    entry = './source/app',
    watch = false,
    platform = 'wx',
    beta = false,
    betaUi = false,
    compress = false,
    huawei = false,
    // loaders,
    plugins = [],
    complete = () => {}
} = {}) {
    const distPath = path.resolve(cwd, platform === 'quick' ? './src' : './dist');
    injectBuildEnv({
        buildType: platform,
        compress,
        huawei
    });
    const webpackConfig = mergeNanachiConfig(nanachiBaseConfig, {
        entry,
        distPath,
        platform,
        compress,
        beta,
        betaUi,
        plugins
    });

    const compiler = webpack(webpackConfig);
    
    if (watch) {
        compiler.watch({}, complete);
    } else {
        compiler.run(complete);
    }
}

module.exports = nanachi;