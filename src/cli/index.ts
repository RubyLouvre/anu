import webpack from 'webpack';
import * as path from 'path';
import platforms from './consts/platforms';
import { build as buildLog, Log, warning, error } from './packages/utils/logger/queue';
import { errorLog, warningLog } from './packages/utils/logger/index';
import chalk from 'chalk';
import getWebPackConfig from './config/webpackConfig';
import * as babel from '@babel/core';
import { spawnSync as spawn } from 'child_process';
import utils from './packages/utils/index';
import globalConfig from './config/config';
import runBeforeParseTasks from './tasks/runBeforeParseTasks';
import createH5Server from './tasks/createH5Server';
import { validatePlatforms } from './config/config';

export interface NanachiOptions {
    watch?: boolean;
    platform?: validatePlatforms;
    beta?: boolean;
    betaUi?: boolean;
    compress?: boolean;
    compressOption?: any;
    huawei?: boolean;
    rules?: Array<webpack.Rule>;
    prevLoaders?: Array<string>;
    postLoaders?: Array<string>;
    plugins?: Array<webpack.Plugin>;
    analysis?: boolean;
    silent?: boolean;
    complete?: Function;
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
    analysis = false,
    silent = false, // 是否显示warning
    // maxAssetSize = 20480, // 最大资源限制，超出报warning
    complete = () => { }
}: NanachiOptions = {}) {
    function callback(err: Error, stats?: webpack.Stats) {
        if (err) {
            // eslint-disable-next-line
            console.log(err);
            return;
        }
       
        showLog();
        const info = stats.toJson();
        if (stats.hasWarnings() && !silent) {
            info.warnings.forEach(warning => {
                // webpack require语句中包含变量会报warning: Critical dependency，此处过滤掉这个warning
                if (!/Critical dependency: the request of a dependency is an expression/.test(warning)) {
                    // eslint-disable-next-line
                    console.log(chalk.yellow('Warning:\n'), utils.cleanLog(warning));
                }
            });
        }
        if (stats.hasErrors()) {
            info.errors.forEach(e => {
                // eslint-disable-next-line
                console.error(chalk.red('Error:\n'), utils.cleanLog(e));
                if (utils.isMportalEnv()) {
                    process.exit();
                }
            });
        }

        if (platform === 'h5') {
            const configPath = watch ? './config/h5/webpack.config.js' : './config/h5/webpack.config.prod.js';
            const webpackH5Config = require(configPath);
            const compilerH5 = webpack(webpackH5Config);
            if (watch) {
                createH5Server(compilerH5);
            } else {
                compilerH5.run(function(err, stats) {
                    if (err) {
                        console.log(err);
                        return;
                    }
                    const info = stats.toJson();
                    if (stats.hasWarnings() && !silent) {
                        info.warnings.forEach(warning => {
                            // webpack require语句中包含变量会报warning: Critical dependency，此处过滤掉这个warning
                            if (!/Critical dependency: the request of a dependency is an expression/.test(warning)) {
                                // eslint-disable-next-line
                                console.log(chalk.yellow('Warning:\n'), utils.cleanLog(warning));
                            }
                        });
                    }
                    if (stats.hasErrors()) {
                        info.errors.forEach(e => {
                            // eslint-disable-next-line
                            console.error(chalk.red('Error:\n'), utils.cleanLog(e));
                            if (utils.isMportalEnv()) {
                                process.exit();
                            }
                        });
                    }
                });
            }
        }
        complete(err, stats);
    }
    try {
        if (!utils.validatePlatform(platform, platforms)) {
            throw new Error(`不支持的platform：${platform}`);
        }

        injectBuildEnv({
            platform,
            compress,
            huawei
        });

        getWebViewRules();

        await runBeforeParseTasks({ platform, beta, betaUi, compress });

        if (compress) {
            // 添加代码压缩loader
            postLoaders.unshift('nanachi-compress-loader');
        }

        const webpackConfig: webpack.Configuration = getWebPackConfig({
            platform,
            compress,
            compressOption,
            beta,
            betaUi,
            plugins,
            analysis,
            prevLoaders,
            postLoaders,
            rules,
            huawei
            // maxAssetSize
        });

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

function injectBuildEnv({ platform, compress, huawei }: NanachiOptions) {
    process.env.ANU_ENV = (platform === 'h5' ? 'web' : platform);
    globalConfig['buildType'] = platform;
    globalConfig['compress'] = compress;
    if (platform === 'quick') {
        globalConfig['huawei'] = huawei || false;
    }
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
    while (warning.length) {
        warningLog(warning.shift());
    }
    
    if (error.length) {
        error.forEach(function(error: Log){
            errorLog(error);
        });
        if ( utils.isMportalEnv() ) {
            process.exit(1);
        }
    }
}

//获取 WEBVIEW 配置
function getWebViewRules() {
    const cwd = process.cwd();
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

    const WebViewRules: any = globalConfig.WebViewRules;
    if (WebViewRules && WebViewRules.pages.length) {
        process.env.ANU_WEBVIEW = 'need_require_webview_file';
    } else {
        process.env.ANU_WEBVIEW = '';
    }

}

export default nanachi;