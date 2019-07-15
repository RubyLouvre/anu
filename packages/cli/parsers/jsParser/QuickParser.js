"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path = __importStar(require("path"));
const JavascriptParser_1 = __importDefault(require("./JavascriptParser"));
const mergeUx = require('../../packages/quickHelpers/mergeUx');
const quickFiles = require('../../packages/quickHelpers/quickFiles');
const utils = require('../../packages/utils/index');
const isStyle = (path) => {
    return /\.(?:less|scss|sass|css)$/.test(path);
};
const thePathHasCommon = /\bcommon\b/;
class QuickParser extends JavascriptParser_1.default {
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
            const result = yield _super.parse.call(this);
            let cssPath = this.extraModules.filter((fileId) => {
                return isStyle(fileId);
            })[0];
            if (cssPath) {
                cssPath = path.resolve(path.dirname(this.filepath), cssPath);
                Object.assign(quickFiles[utils.fixWinPath(this.filepath)], {
                    cssPath
                });
            }
            this.queues = result.options.anu && result.options.anu.queue || this.queues;
            const uxRes = yield mergeUx({
                sourcePath: this.filepath,
                result,
                relativePath: this.relativePath
            }, this.queues);
            if (uxRes.type === 'ux') {
                this.queues.push({
                    type: uxRes.type,
                    path: this.relativePath,
                    code: this.getUxCode(),
                });
            }
            else {
                this.queues.push({
                    type: uxRes.type,
                    path: this.relativePath,
                    code: uxRes.code,
                    ast: this.ast,
                });
            }
            return result;
        });
    }
    getUxCode() {
        const obj = quickFiles[utils.fixWinPath(this.filepath)];
        let code = obj.header + '\n' + obj.jsCode;
        if (obj.cssPath) {
            let relativePath = path.relative(path.dirname(this.filepath), obj.cssPath);
            relativePath = /^\w/.test(relativePath) ? './' + relativePath : relativePath;
            relativePath = relativePath
                .replace(/\\/g, '/')
                .replace(/\.(scss|sass|less)$/, '.css');
            code += `\n<style>\n@import '${relativePath}';\n</style>`;
        }
        return code;
    }
}
exports.default = QuickParser;
