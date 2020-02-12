"use strict";
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
const plugin_1 = __importDefault(require("../nanachi-loader/plugin"));
const sizePlugin_1 = __importDefault(require("../nanachi-loader/sizePlugin"));
const quickPlugin_1 = __importDefault(require("../nanachi-loader/quickPlugin"));
const chaikaPlugin_1 = __importDefault(require("../nanachi-loader/chaika-plugin/chaikaPlugin"));
const copy_webpack_plugin_1 = __importDefault(require("copy-webpack-plugin"));
const path = __importStar(require("path"));
const webpack_1 = __importDefault(require("webpack"));
const utils = require('../packages/utils/index');
const configurations_1 = require("./h5/configurations");
const quickAPIList_1 = __importDefault(require("../consts/quickAPIList"));
const config_1 = __importDefault(require("./config"));
const fileLoader = require.resolve('../nanachi-loader/loaders/fileLoader');
const aliasLoader = require.resolve('../nanachi-loader/loaders/aliasLoader');
const nanachiLoader = require.resolve('../nanachi-loader/loaders/nanachiLoader');
const nodeLoader = require.resolve('../nanachi-loader/loaders/nodeLoader');
const reactLoader = require.resolve('../nanachi-loader/loaders/reactLoader');
const nanachiStyleLoader = require.resolve('../nanachi-loader/loaders/nanachiStyleLoader');
const cwd = process.cwd();
const H5AliasList = ['react', '@react', 'react-dom', 'react-loadable', '@qunar-default-loading', '@dynamic-page-loader', /^@internalComponents/];
const isChaikaMode = function () {
    return process.env.NANACHI_CHAIK_MODE === 'CHAIK_MODE';
};
const quickConfigFileName = config_1.default.huawei && utils.isCheckQuickConfigFileExist("quickConfig.huawei.json")
    ? "quickConfig.huawei.json"
    : "quickConfig.json";
function default_1({ platform, compress, compressOption, plugins, rules, huawei, analysis, typescript, prevLoaders, postLoaders, prevJsLoaders, postJsLoaders, prevCssLoaders, postCssLoaders, }) {
    let externals = quickAPIList_1.default;
    if (platform === 'h5') {
        externals.push(...H5AliasList);
    }
    let aliasMap = require('../packages/utils/calculateAliasConfig')();
    let distPath = '';
    if (process.env.NANACHI_CHAIK_MODE === 'CHAIK_MODE') {
        distPath = path.resolve(cwd, '../../', utils.getDistName(platform));
    }
    else {
        distPath = path.resolve(cwd, utils.getDistName(platform));
    }
    if (platform === 'h5') {
        distPath = path.join(distPath, configurations_1.intermediateDirectoryName);
    }
    let copyPluginOption = null;
    if (compress) {
        const compressImage = require(path.resolve(cwd, 'node_modules', 'nanachi-compress-loader/utils/compressImage.js'));
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
            use: [].concat(fileLoader, postLoaders, aliasLoader, nodeLoader)
        }];
    const copyAssetsRules = [Object.assign({ from: '**', to: 'assets', context: 'source/assets', ignore: [
                '**/*.@(js|jsx|json|sass|scss|less|css|ts|tsx)'
            ] }, copyPluginOption)];
    const mergePlugins = [].concat(isChaikaMode() ? [new chaikaPlugin_1.default()] : [], analysis ? new sizePlugin_1.default() : [], new plugin_1.default({
        platform,
        compress
    }), new copy_webpack_plugin_1.default(copyAssetsRules), plugins);
    const mergeRule = [].concat({
        test: /\.[jt]sx?$/,
        use: [].concat(fileLoader, postLoaders, postJsLoaders, platform !== 'h5' ? aliasLoader : [], nanachiLoader, {
            loader: require.resolve('eslint-loader'),
            options: {
                configFile: require.resolve(`./eslint/.eslintrc-${platform}.js`),
                failOnError: utils.isMportalEnv(),
                allowInlineConfig: false,
                useEslintrc: false
            }
        }, typescript ? {
            loader: require.resolve('ts-loader'),
            options: {
                context: path.resolve(cwd)
            }
        } : [], prevJsLoaders, prevLoaders),
        exclude: /node_modules[\\/](?!schnee-ui[\\/])|React/,
    }, platform !== 'h5' ? nodeRules : [], {
        test: /React\w+/,
        use: [].concat(fileLoader, postLoaders, nodeLoader, reactLoader)
    }, {
        test: /\.(s[ca]ss|less|css)$/,
        use: [].concat(fileLoader, postLoaders, postCssLoaders, platform !== 'h5' ? aliasLoader : [], nanachiStyleLoader, prevCssLoaders, prevLoaders)
    }, {
        test: /\.(jpg|png|gif)$/,
        loader: require.resolve('file-loader'),
        options: {
            outputPath: 'assets',
            name: '[name].[hash:10].[ext]'
        }
    }, rules);
    if (platform === 'quick') {
        mergePlugins.push(new quickPlugin_1.default());
        try {
            var quickConfig = {};
            quickConfig = require(path.join(cwd, "source", quickConfigFileName));
            if (huawei) {
                if (quickConfig && quickConfig.widgets) {
                    quickConfig.widgets.forEach(widget => {
                        const widgetPath = widget.path;
                        if (widgetPath) {
                            const rule = Object.assign({ from: '**', to: widgetPath.replace(/^[\\/]/, ''), context: path.join('source', widgetPath) }, copyPluginOption);
                            copyAssetsRules.push(rule);
                        }
                    });
                }
            }
            else if (quickConfig && quickConfig.router && quickConfig.router.widgets) {
                Object.keys(quickConfig.router.widgets).forEach(key => {
                    const widgetPath = quickConfig.router.widgets[key].path;
                    if (widgetPath) {
                        const rule = Object.assign({ from: '**', to: widgetPath.replace(/^[\\/]/, ''), context: path.join('source', widgetPath) }, copyPluginOption);
                        copyAssetsRules.push(rule);
                    }
                });
            }
        }
        catch (err) {
        }
    }
    if (platform === 'h5') {
        mergePlugins.push(new webpack_1.default.IgnorePlugin({
            resourceRegExp: /\.(\w?ux|pem)$/,
        }));
    }
    let entry = path.join(cwd, 'source/app');
    if (typescript) {
        entry += '.tsx';
    }
    ;
    return {
        entry: entry,
        mode: 'development',
        output: {
            path: distPath,
            filename: 'index.bundle.js'
        },
        module: {
            rules: mergeRule
        },
        plugins: mergePlugins,
        resolve: {
            alias: aliasMap,
            extensions: [
                '.js', '.jsx', '.json', '.ts', '.tsx'
            ],
            mainFields: ['main'],
            symlinks: false,
            modules: [
                path.join(process.cwd(), 'node_modules')
            ]
        },
        watchOptions: {
            ignored: /dist/
        },
        externals
    };
}
exports.default = default_1;
;
