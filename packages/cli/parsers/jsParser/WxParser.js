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
Object.defineProperty(exports, "__esModule", { value: true });
const JavascriptParser_1 = __importDefault(require("./JavascriptParser"));
const thePathHasCommon = /\bcommon\b/;
class WxParser extends JavascriptParser_1.default {
    constructor(props) {
        super(props);
        this.filterCommonFile = thePathHasCommon.test(this.filepath) ? [] : require('../../packages/babelPlugins/transformMiniApp')(this.filepath);
        this._babelPlugin = {
            configFile: false,
            babelrc: false,
            comments: false,
            ast: true,
            plugins: [
                [require('@babel/plugin-proposal-decorators'), { legacy: true }],
                [
                    require('@babel/plugin-proposal-class-properties'),
                    { loose: true }
                ],
                require('@babel/plugin-proposal-object-rest-spread'),
                [
                    require('babel-plugin-import').default,
                    {
                        libraryName: 'schnee-ui',
                        libraryDirectory: 'components',
                        camel2DashComponentName: false
                    }
                ],
                require('@babel/plugin-syntax-jsx'),
                require('../../packages/babelPlugins/collectDependencies'),
                require('../../packages/babelPlugins/collectTitleBarConfig'),
                require('../../packages/babelPlugins/patchComponents'),
                ...require('../../packages/babelPlugins/transformEnv'),
                [require('@babel/plugin-transform-template-literals'), { loose: true }],
                require('../../packages/babelPlugins/transformIfImport'),
                ...this.filterCommonFile,
                ...require('../../packages/babelPlugins/patchAsyncAwait'),
            ]
        };
    }
    parse() {
        const _super = Object.create(null, {
            parse: { get: () => super.parse }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield _super.parse.call(this);
            this.queues = res.options.anu && res.options.anu.queue || this.queues;
            this.extraModules = res.options.anu && res.options.anu.extraModules || this.extraModules;
            this.queues.push({
                type: 'js',
                path: this.relativePath,
                code: res.code,
                ast: this.ast,
                extraModules: this.extraModules
            });
            return res;
        });
    }
}
exports.default = WxParser;
