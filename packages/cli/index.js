const webpack = require('webpack');
const path = require('path');
const cwd = process.cwd();
const globalConfig = require('./config/config.js');
const runBeforeParseTasks = require('./commands/runBeforeParseTasks');
const platforms = require('./consts/platforms');
const utils = require('./packages/utils/index');
const { errorLog, warningLog } = require('./nanachi-loader/logger/index');
const { build: buildLog } = require('./nanachi-loader/logger/queue');

const babel = require('@babel/core');
const spawn = require('child_process').spawnSync;

//获取 WEBVIEW 配置
function getWebViewRules() {
    if (globalConfig.buildType != 'quick') return;
    let bin = 'grep';
    let opts = ['-r', '-E', "pages:\\s*(\\btrue\\b|\\[.+\\])", path.join(cwd, 'source', 'pages')];
    let ret = spawn(bin, opts).stdout.toString().trim();

    let webViewRoutes = ret.split(/\s/)
        .filter(function (el) {
            return /\/pages\//.test(el)
        }).map(function (el) {
            return el.replace(/\:$/g, '')
        });

    webViewRoutes.forEach(async function (pagePath) {
        babel.transformFileSync(pagePath, {
            configFile: false,
            babelrc: false,
            comments: false,
            ast: true,
            presets: [
                require('@babel/preset-react')
            ],
            plugins: [
                [require('@babel/plugin-proposal-decorators'), { legacy: true }],
                [require('@babel/plugin-proposal-class-properties'), { loose: true }],
                require('@babel/plugin-proposal-object-rest-spread'),
                require('@babel/plugin-syntax-jsx'),
                require('./packages/babelPlugins/collectWebViewPage'),
            ]
        });
    });


    if (globalConfig.WebViewRules && globalConfig.WebViewRules.pages.length) {
        process.env.ANU_WEBVIEW = 'need_require_webview_file';
    } else {
        process.env.ANU_WEBVIEW = '';
    }

}

function injectBuildEnv({ buildType, compress, huawei } = {}) {
    process.env.ANU_ENV = buildType;
    globalConfig['buildType'] = buildType;
    globalConfig['compress'] = compress;
    if (buildType === 'quick') {
        globalConfig['huawei'] = huawei || false;
    }
}

function validatePlatform(platform) {
    return platforms.some((p) => {
        return p.buildType === platform;
    });
}

function showLog() {
    if ( utils.isMportalEnv() ) {
        let log = '';
        while (buildLog.length) {
            log += buildLog.shift() + (buildLog.length !== 0 ? '\n' : '');
        }
        // eslint-disable-next-line
        console.log(log);
    }
    const errorStack = require('./nanachi-loader/logger/queue');
    while (errorStack.warning.length) {
        warningLog(errorStack.warning.shift());
    }
    
    if (errorStack.error.length) {
        errorStack.error.forEach(function(error){
            errorLog(error);
        });
        if ( utils.isMportalEnv() ) {
            process.exit(1);
        }
    }
}

function cleanLog(log) {
    // 清理eslint stylelint错误日志内容
    const reg = /[\s\S]*Module (Error|Warning)\s*\(.*?(es|style)lint.*?\):\n+/gm;
    if (reg.test(log)) {
        return log.replace(/^\s*@[\s\S]*$/gm, '').replace(reg, '');
    }
    return log;
}

async function nanachi({
    // entry = './source/app', // TODO: 入口文件配置暂时不支持
    watch = false,
    platform = 'wx',
    beta = false,
    betaUi = false,
    compress = false,
    compressOption = {},
    huawei = false,
    rules = [],
    prevLoaders = [], // 自定义预处理loaders
    postLoaders = [], // 自定义后处理loaders
    plugins = [],
    complete = () => { }
} = {}) {
    function callback(err, stats) {

        if (err) {
            // eslint-disable-next-line
            console.log(err);
            return;
        }

        showLog();
        const info = stats.toJson();
        if (stats.hasErrors()) {
            info.errors.forEach(e => {
                // eslint-disable-next-line
                console.error(cleanLog(e));
                if (utils.isMportalEnv()) {
                    process.exit();
                }
            });
        }
        if (stats.hasWarnings()) {
            info.warnings.forEach(warning => {
                // eslint-disable-next-line
                console.warn(cleanLog(warning));
            });
        }
        complete(err, stats);
    }
    try {

        if (!validatePlatform(platform)) {
            throw new Error(`不支持的platform：${platform}`);
        }

        if (platform === 'h5') {
            require(`mini-html5/runkit/${watch ? 'run' : 'build'}`);
            return;
        }


        injectBuildEnv({
            buildType: platform,
            compress,
            huawei
        });

        getWebViewRules();

        // 添加解码中文字符loader
        // postLoaders.unshift(require.resolve('./nanachi-loader/loaders/decodeChineseLoader'));
        if (compress) {
            // 添加代码压缩loader
            postLoaders.unshift(require.resolve('nanachi-compress-loader'));
        }

        const webpackConfig = require('./config/webpackConfig')({
            platform,
            compress,
            compressOption,
            beta,
            betaUi,
            plugins,
            prevLoaders,
            postLoaders,
            rules
        });

        await runBeforeParseTasks({ buildType: platform, beta, betaUi });

        const compiler = webpack(webpackConfig);

        if (watch) {
            compiler.watch({}, callback);
        } else {
            compiler.run(callback);
        }
    } catch (err) {
        callback(err);
    }

}

module.exports = nanachi;