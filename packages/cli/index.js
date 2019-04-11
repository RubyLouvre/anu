const webpack = require('webpack');
const path = require('path');
const cwd = process.cwd();
const globalConfig = require('./packages/config.js');
const runBeforeParseTasks = require('./commands/runBeforeParseTasks');

function injectBuildEnv({ buildType, compress, huawei } = {}){
    process.env.ANU_ENV = buildType;
    globalConfig['buildType'] = buildType;
    globalConfig['compress'] = compress;
    if (buildType === 'quick') {
        globalConfig['huawei'] = huawei || false;
    }
}

async function nanachi({
    entry = './source/app',
    watch = false,
    platform = 'wx',
    beta = false,
    betaUi = false,
    compress = false,
    huawei = false,
    rules = [],
    plugins = [],
    complete = () => {}
} = {}) {
    injectBuildEnv({
        buildType: platform,
        compress,
        huawei
    });
    const webpackConfig = require('./config/webpackConfig')({
        entry,
        platform,
        compress,
        beta,
        betaUi,
        plugins,
        rules
    });
    await runBeforeParseTasks({ buildType: platform, beta, betaUi });
    
    const compiler = webpack(webpackConfig);
    
    if (watch) {
        compiler.watch({}, complete);
    } else {
        compiler.run(complete);
    }
}

module.exports = nanachi;