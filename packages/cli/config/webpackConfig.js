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
const utils = require('../packages/utils/index');
const configurations_1 = require("./h5/configurations");
const fileLoader = require.resolve('../nanachi-loader/loaders/fileLoader');
const aliasLoader = require.resolve('../nanachi-loader/loaders/aliasLoader');
const nanachiLoader = require.resolve('../nanachi-loader/loaders/nanachiLoader');
const nodeLoader = require.resolve('../nanachi-loader/loaders/nodeLoader');
const reactLoader = require.resolve('../nanachi-loader/loaders/reactLoader');
const nanachiStyleLoader = require.resolve('../nanachi-loader/loaders/nanachiStyleLoader');
const cwd = process.cwd();
function default_1({ platform, compress, compressOption, plugins, rules, huawei, analysis, typescript, prevLoaders, postLoaders, prevJsLoaders, postJsLoaders, prevCssLoaders, postCssLoaders, }) {
    let aliasMap = require('../packages/utils/calculateAliasConfig')();
    let distPath = path.resolve(cwd, utils.getDistName(platform));
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
    const mergePlugins = [].concat(new chaikaPlugin_1.default(), analysis ? new sizePlugin_1.default() : [], new plugin_1.default({
        platform,
        compress
    }), new copy_webpack_plugin_1.default(copyAssetsRules), plugins);
    const mergeRule = [].concat({
        test: /\.[jt]sx?$/,
        use: [].concat(fileLoader, postLoaders, postJsLoaders, platform !== 'h5' ? aliasLoader : [], nanachiLoader, typescript ? require.resolve('ts-loader') : [], prevJsLoaders, prevLoaders),
        exclude: /node_modules[\\/](?!schnee-ui[\\/])|React/,
    }, platform !== 'h5' ? nodeRules : [], {
        test: /React\w+/,
        use: [].concat(fileLoader, postLoaders, nodeLoader, reactLoader),
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
            process.env.NANACHI_CHAIK_MODE === 'CHAIK_MODE'
                ? quickConfig = require(path.join(cwd, '.CACHE/nanachi/source', 'quickConfig.json'))
                : quickConfig = require(path.join(cwd, 'source', 'quickConfig.json'));
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
    let entry = process.env.NANACHI_CHAIK_MODE === 'CHAIK_MODE'
        ? path.join(cwd, '.CACHE/nanachi/source/app')
        : path.join(cwd, 'source/app');
    if (typescript) {
        entry += '.ts';
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
            extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
            mainFields: ['main'],
            symlinks: true,
            modules: [
                path.join(process.cwd(), 'node_modules')
            ]
        },
        watchOptions: {
            ignored: /node_modules|dist/
        },
        externals: platform === 'h5' ? ['react', '@react', 'react-dom', 'react-loadable', '@qunar-default-loading', '@dynamic-page-loader', /^@internalComponents/] : []
    };
}
exports.default = default_1;
;
