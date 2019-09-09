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
const fs = __importStar(require("fs-extra"));
const platforms_1 = __importDefault(require("./consts/platforms"));
const queue_1 = require("./packages/utils/logger/queue");
const index_1 = require("./packages/utils/logger/index");
const chalk_1 = __importDefault(require("chalk"));
const webpackConfig_1 = __importDefault(require("./config/webpackConfig"));
const babel = __importStar(require("@babel/core"));
const child_process_1 = require("child_process");
const index_2 = __importDefault(require("./packages/utils/index"));
const config_1 = __importDefault(require("./config/config"));
const runBeforeParseTasks_1 = __importDefault(require("./tasks/runBeforeParseTasks"));
const createH5Server_1 = __importDefault(require("./tasks/createH5Server"));
function nanachi(options = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const { watch = false, platform = 'wx', beta = false, betaUi = false, compress = false, compressOption = {}, huawei = false, typescript = false, rules = [], prevLoaders = [], postLoaders = [], prevJsLoaders = [], postJsLoaders = [], prevCssLoaders = [], postCssLoaders = [], plugins = [], analysis = false, silent = false, complete = () => { } } = options;
        function callback(err, stats) {
            if (err) {
                console.log(err);
                return;
            }
            showLog();
            const info = stats.toJson();
            if (stats.hasWarnings() && !silent) {
                info.warnings.forEach(warning => {
                    if (!/Critical dependency: the request of a dependency is an expression/.test(warning)) {
                        console.log(chalk_1.default.yellow('Warning:\n'), index_2.default.cleanLog(warning));
                    }
                });
            }
            if (stats.hasErrors()) {
                info.errors.forEach(e => {
                    console.error(chalk_1.default.red('Error:\n'), index_2.default.cleanLog(e));
                    if (index_2.default.isMportalEnv()) {
                        process.exit();
                    }
                });
            }
            if (platform === 'h5') {
                const configPath = watch ? './config/h5/webpack.config.js' : './config/h5/webpack.config.prod.js';
                const webpackH5Config = require(configPath);
                const compilerH5 = webpack_1.default(webpackH5Config);
                if (watch) {
                    createH5Server_1.default(compilerH5);
                }
                else {
                    compilerH5.run(function (err, stats) {
                        if (err) {
                            console.log(err);
                            return;
                        }
                        const info = stats.toJson();
                        if (stats.hasWarnings() && !silent) {
                            info.warnings.forEach(warning => {
                                if (!/Critical dependency: the request of a dependency is an expression/.test(warning)) {
                                    console.log(chalk_1.default.yellow('Warning:\n'), index_2.default.cleanLog(warning));
                                }
                            });
                        }
                        if (stats.hasErrors()) {
                            info.errors.forEach(e => {
                                console.error(chalk_1.default.red('Error:\n'), index_2.default.cleanLog(e));
                                if (index_2.default.isMportalEnv()) {
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
            if (!index_2.default.validatePlatform(platform, platforms_1.default)) {
                throw new Error(`不支持的platform：${platform}`);
            }
            const useTs = fs.existsSync(path.resolve(process.cwd(), './source/app.ts'));
            if (useTs && !typescript) {
                throw '检测到app.ts，请使用typescript模式编译(-t/--typescript)';
            }
            injectBuildEnv({
                platform,
                compress,
                huawei
            });
            getWebViewRules();
            yield runBeforeParseTasks_1.default({ platform, beta, betaUi, compress });
            if (compress) {
                postLoaders.unshift('nanachi-compress-loader');
            }
            const webpackConfig = webpackConfig_1.default({
                platform,
                compress,
                compressOption,
                beta,
                betaUi,
                plugins,
                typescript,
                analysis,
                prevLoaders,
                postLoaders,
                prevJsLoaders,
                postJsLoaders,
                prevCssLoaders,
                postCssLoaders,
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
    config_1.default['buildType'] = platform;
    config_1.default['compress'] = compress;
    if (platform === 'quick') {
        config_1.default['huawei'] = huawei || false;
    }
}
function showLog() {
    if (index_2.default.isMportalEnv()) {
        let log = '';
        while (queue_1.build.length) {
            log += queue_1.build.shift() + (queue_1.build.length !== 0 ? '\n' : '');
        }
        console.log(log);
    }
    while (queue_1.warning.length) {
        index_1.warningLog(queue_1.warning.shift());
    }
    if (queue_1.error.length) {
        queue_1.error.forEach(function (error) {
            index_1.errorLog(error);
        });
        if (index_2.default.isMportalEnv()) {
            process.exit(1);
        }
    }
}
function getWebViewRules() {
    const cwd = process.cwd();
    if (config_1.default.buildType != 'quick')
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
    });
    const WebViewRules = config_1.default.WebViewRules;
    if (WebViewRules && WebViewRules.pages.length) {
        process.env.ANU_WEBVIEW = 'need_require_webview_file';
    }
    else {
        process.env.ANU_WEBVIEW = '';
    }
}
exports.default = nanachi;
