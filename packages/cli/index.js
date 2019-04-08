const webpack = require('webpack');
const path = require('path');
const cwd = process.cwd();
const NanachiWebpackPlugin = require('./nanachi-loader/plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const globalConfig = require('./packages/config.js');
const { REACT_LIB_MAP } = require('./consts/index');
const runBeforeParseTasks = require('./commands/runBeforeParseTasks');
const nanachiBaseConfig = require('./config/nanachiBaseConfig');

function injectBuildEnv({ buildType, compress, huawei } = {}){
    process.env.ANU_ENV = buildType;
    globalConfig['buildType'] = buildType;
    globalConfig['compress'] = compress;
    if (buildType === 'quick') {
        globalConfig['huawei'] = huawei || false;
    }
}

function mergeNanachiConfig(nanachiBaseConfig, {
    entry,
    distPath,
    platform,
    compress,
    plugins
}) {
    Object.assign(nanachiBaseConfig, {
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
                // copy core react
                {
                    from: path.resolve(cwd, 'source', REACT_LIB_MAP[platform]),
                    to: distPath
                },
                // // copy regenerator-runtime
                // {
                //     from: path.resolve(cwd, './node_modules/regenerator-runtime'),
                //     to: path.resolve(distPath, './npm/regenerator-runtime')
                // },
                // // copy schnee-ui
                // {
                //     from: path.resolve(cwd, './node_modules/schnee-ui'),
                //     to: path.resolve(distPath, './npm/schnee-ui')
                // }
            ], {
                copyUnmodified: true
            }),
            new NanachiWebpackPlugin({
                platform,
                compress
            })
        ].concat(plugins)
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
    // TODO：移除复制assets目录操作，使用copy-webpack-plugin插件完成
    await runBeforeParseTasks({
        buildType: platform,
        beta,
        betaUi
    });
    mergeNanachiConfig(nanachiBaseConfig, {
        entry,
        distPath,
        platform,
        compress,
        plugins
    });
    
    const compiler = webpack(nanachiBaseConfig);
    
    if (watch) {
        compiler.watch({}, complete);
    } else {
        compiler.run(complete);
    }
}

module.exports = nanachi;