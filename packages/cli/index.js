"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const webpack_1 = __importDefault(require("webpack"));
const path = __importStar(require("path"));
const globalConfig = require('./config/config.js');
const runBeforeParseTasks = require('./tasks/runBeforeParseTasks');
const createH5Server = require('./tasks/createH5Server');
const platforms_1 = __importDefault(require("./consts/platforms"));
const utils = require('./packages/utils/index');
const { errorLog, warningLog } = require('./nanachi-loader/logger/index');
const { build: buildLog } = require('./nanachi-loader/logger/queue');
const chalk_1 = __importDefault(require("chalk"));
const getWebPackConfig = require('./config/webpackConfig');
const core_1 = __importDefault(require("@babel/core"));
const child_process_1 = require("child_process");
function nanachi({ watch = false, platform = 'wx', beta = false, betaUi = false, compress = false, compressOption = {}, huawei = false, rules = [], prevLoaders = [], postLoaders = [], plugins = [], analysis = false, silent = false, complete = () => { } } = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        function callback(err, stats) {
            if (err) {
                console.log(err);
                return;
            }
            showLog();
            const info = stats.toJson();
            if (stats.hasErrors()) {
                info.errors.forEach(e => {
                    console.error(chalk_1.default.red('Error:\n'), utils.cleanLog(e));
                    if (utils.isMportalEnv()) {
                        process.exit();
                    }
                });
            }
            if (stats.hasWarnings() && !silent) {
                info.warnings.forEach(warning => {
                    if (!/Critical dependency: the request of a dependency is an expression/.test(warning)) {
                        console.log(chalk_1.default.yellow('Warning:\n'), utils.cleanLog(warning));
                    }
                });
            }
            if (platform === 'h5') {
                const configPath = watch ? './config/h5/webpack.config.js' : './config/h5/webpack.config.prod.js';
                const webpackH5Config = require(configPath);
                const compilerH5 = webpack_1.default(webpackH5Config);
                if (watch) {
                    createH5Server(compilerH5);
                }
                else {
                    compilerH5.run(function (err, stats) {
                        if (err) {
                            console.log(err);
                            return;
                        }
                        const info = stats.toJson();
                        if (stats.hasErrors()) {
                            info.errors.forEach(e => {
                                console.error(chalk_1.default.red('Error:\n'), utils.cleanLog(e));
                                if (utils.isMportalEnv()) {
                                    process.exit();
                                }
                            });
                        }
                        if (stats.hasWarnings() && !silent) {
                            info.warnings.forEach(warning => {
                                if (!/Critical dependency: the request of a dependency is an expression/.test(warning)) {
                                    console.log(chalk_1.default.yellow('Warning:\n'), utils.cleanLog(warning));
                                }
                            });
                        }
                    });
                }
            }
            complete(err, stats);
        }
        try {
            if (!utils.validatePlatform(platform, platforms_1.default)) {
                throw new Error(`不支持的platform：${platform}`);
            }
            injectBuildEnv({
                platform,
                compress,
                huawei
            });
            getWebViewRules();
            yield runBeforeParseTasks({ buildType: platform, beta, betaUi, compress });
            if (compress) {
                postLoaders.unshift('nanachi-compress-loader');
            }
            const webpackConfig = getWebPackConfig({
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
            });
            const compiler = webpack_1.default(webpackConfig);
            if (watch) {
                compiler.watch({}, callback);
            }
            else {
                compiler.run(callback);
            }
        }
        catch (err) {
            callback(err);
        }
    });
}
function injectBuildEnv({ platform, compress, huawei }) {
    process.env.ANU_ENV = (platform === 'h5' ? 'web' : platform);
    globalConfig['buildType'] = platform;
    globalConfig['compress'] = compress;
    if (platform === 'quick') {
        globalConfig['huawei'] = huawei || false;
    }
}
function showLog() {
    if (utils.isMportalEnv()) {
        let log = '';
        while (buildLog.length) {
            log += buildLog.shift() + (buildLog.length !== 0 ? '\n' : '');
        }
        console.log(log);
    }
    const errorStack = require('./nanachi-loader/logger/queue');
    while (errorStack.warning.length) {
        warningLog(errorStack.warning.shift());
    }
    if (errorStack.error.length) {
        errorStack.error.forEach(function (error) {
            errorLog(error);
        });
        if (utils.isMportalEnv()) {
            process.exit(1);
        }
    }
}
function getWebViewRules() {
    const cwd = process.cwd();
    if (globalConfig.buildType != 'quick')
        return;
    let bin = 'grep';
    let opts = ['-r', '-E', "pages:\\s*(\\btrue\\b|\\[.+\\])", path.join(cwd, 'source', 'pages')];
    let ret = child_process_1.spawnSync(bin, opts).stdout.toString().trim();
    let webViewRoutes = ret.split(/\s/)
        .filter(function (el) {
        return /\/pages\//.test(el);
    }).map(function (el) {
        return el.replace(/\:$/g, '');
    });
    webViewRoutes.forEach(function (pagePath) {
        return __awaiter(this, void 0, void 0, function* () {
            core_1.default.transformFileSync(pagePath, {
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
    });
    if (globalConfig.WebViewRules && globalConfig.WebViewRules.pages.length) {
        process.env.ANU_WEBVIEW = 'need_require_webview_file';
    }
    else {
        process.env.ANU_WEBVIEW = '';
    }
}
exports.default = nanachi;
