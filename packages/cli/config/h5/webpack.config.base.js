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
const webpack_1 = __importDefault(require("webpack"));
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = __importStar(require("path"));
const ramda_1 = __importDefault(require("ramda"));
const configurations_1 = require("./configurations");
const fs = __importStar(require("fs-extra"));
const context = path.resolve(process.cwd(), 'dist');
const h5helperPath = path.resolve(__dirname, '../../packages/h5Helpers');
const resolveFromContext = ramda_1.default.curryN(2, path.resolve)(context);
const resolveFromDirCwd = ramda_1.default.curryN(2, path.resolve)(process.cwd());
const resolveFromH5Helper = ramda_1.default.curryN(2, path.resolve)(h5helperPath);
let templatePath = resolveFromH5Helper('./index.html');
try {
    const userTemplatePath = resolveFromDirCwd('./index.html');
    fs.statSync(userTemplatePath);
    templatePath = userTemplatePath;
}
catch (e) {
}
const webpackConfig = {
    mode: 'development',
    context,
    target: 'web',
    entry: resolveFromContext(`${configurations_1.intermediateDirectoryName}/app.js`),
    output: {
        path: resolveFromDirCwd(configurations_1.outputDirectory),
        filename: 'bundle.[hash:10].js',
        publicPath: '/web/'
    },
    resolve: {
        alias: Object.assign({}, configurations_1.retrieveNanachiConfig(), { react: resolveFromDirCwd('./source/ReactH5.js'), '@react': resolveFromDirCwd('./source/ReactH5.js'), 'react-dom': resolveFromDirCwd('./source/ReactH5.js'), 'schnee-ui': resolveFromContext(`${configurations_1.intermediateDirectoryName}/npm/schnee-ui`), '@internalComponents': resolveFromH5Helper('components'), '@internalConsts': path.resolve(__dirname, '../../consts/'), '@components': resolveFromContext(`${configurations_1.intermediateDirectoryName}/components`), '@qunar-default-loading': resolveFromH5Helper('components/Loading') }),
        modules: ['node_modules', path.resolve(__dirname, '../../node_modules'), resolveFromDirCwd('node_modules')]
    },
    module: {
        rules: [
            {
                test: /\.s[ac]ss$/,
                use: [
                    require.resolve('style-loader'),
                    require.resolve('css-loader'),
                    {
                        loader: require.resolve('postcss-sass-loader'),
                        options: {
                            plugin: []
                        }
                    }
                ]
            },
            {
                test: /\.(le|c)ss$/,
                use: [
                    require.resolve('style-loader'),
                    require.resolve('css-loader'),
                    {
                        loader: require.resolve('postcss-less-loader'),
                        options: {
                            plugin: []
                        }
                    }
                ]
            },
            {
                test: /\.(jpg|png|gif)$/,
                loader: require.resolve('file-loader'),
                options: {
                    outputPath: 'assets',
                    name: '[name].[hash:10].[ext]'
                }
            }
        ]
    },
    devtool: 'cheap-source-map',
    plugins: [
        new HtmlWebpackPlugin({
            template: templatePath
        }),
        new webpack_1.default.EnvironmentPlugin(Object.assign({ ANU_ENV: 'web' }, process.env)),
    ],
    stats: 'errors-only'
};
exports.default = webpackConfig;
