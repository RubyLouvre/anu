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
const webpack_config_base_1 = __importDefault(require("./webpack.config.base"));
const path = __importStar(require("path"));
const webpack_merge_1 = __importDefault(require("webpack-merge"));
const pageWrapper = path.resolve(process.cwd(), "node_modules/schnee-ui/h5/components/pageWrapper");
const config = webpack_merge_1.default(webpack_config_base_1.default, {
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.[jt]sx?$/,
                loader: require.resolve('babel-loader'),
                options: {
                    cacheDirectory: true,
                    root: pageWrapper,
                    plugins: [
                        require.resolve('@babel/plugin-transform-runtime'),
                        require.resolve('@babel/plugin-syntax-dynamic-import'),
                        require.resolve('@babel/plugin-proposal-object-rest-spread'),
                        [require.resolve('@babel/plugin-proposal-decorators'), { legacy: true }],
                        [require.resolve('@babel/plugin-proposal-class-properties'), { loose: true }]
                    ],
                    presets: [require.resolve('@babel/preset-react')]
                }
            }
        ]
    },
    optimization: {
        noEmitOnErrors: true
    },
    performance: {
        hints: false
    }
});
exports.default = config;
module.exports = config;
